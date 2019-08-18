import React, { useContext, useState } from 'react';
import { GameContext } from '../GameProvider/GameProvider';
import Form from '../../shared/Form/Form';
import MultiSelect from '../../shared/MultiSelect/MultiSelect';
import CheckboxGroup from '../../shared/CheckboxGroup/CheckboxGroup';
import Checkbox from '../../shared/Checkbox/Checkbox';
import { FieldArray } from 'formik';
import './GameSettings.css';
import ClickedOutsideChecker from '../../shared/ClickedOutsideChecker/ClickedOutsideChecker';
import Octicon, { Question } from '@githubprimer/octicons-react';

export default function GameSettings(props: {}) {
    const {
        selectedElements,
        changeGameStarted,
        onSubmit,
        getPackagesOfSubjects,
        getCardsOfPackages,
        subjects,
        packages,
        filterCardsByKnowledge,
        showingCards,
        gameStarted,
        cards,
    } = useContext(GameContext);

    return (
        <div className="game-settings">
            <Form
                initialValues={selectedElements}
                onSubmit={values => {
                    console.log(values);
                    changeGameStarted();
                    onSubmit(values);
                }}
                enableReinitialize
            >
                {({ handleChange, handleBlur, values, setFieldValue, setFieldTouched, errors, touched }, FormRow) => {
                    return (
                        <React.Fragment>
                            <RoleHints />
                            <MultiSelect
                                label="Selected subjects:"
                                value={values.selectedSubjects}
                                name="selectedSubjects"
                                className="subjects-select"
                                onChange={value => {
                                    setFieldValue('selectedSubjects', value);
                                    getPackagesOfSubjects(value);
                                }}
                                options={
                                    subjects &&
                                    subjects.map(subject => {
                                        return { value: subject.id, label: subject.title };
                                    })
                                }
                                isDisabled={values.selectedPackages.length !== 0}
                                placeholder="Select subjects"
                            />
                            <MultiSelect
                                label="Selected packages:"
                                value={values.selectedPackages}
                                name="selectedPackages"
                                className="packages-select"
                                onChange={value => {
                                    setFieldValue('selectedPackages', value);
                                    getCardsOfPackages(value);
                                }}
                                options={
                                    packages &&
                                    packages.map(pack => {
                                        return { value: pack.id, label: pack.title };
                                    })
                                }
                                isDisabled={values.selectedHardnessIDs.length !== 0}
                                placeholder="Select packages"
                            />
                            <FieldArray
                                name="selectedHardnessIDs"
                                render={arrayHelpers => (
                                    <div className="cards-harndess">
                                        <CheckboxGroup
                                            checkboxes={[
                                                { label: `★ (${cardsAtKnowledge(1)} card)`, id: '1' },
                                                { label: `★★ (${cardsAtKnowledge(2)} card)`, id: '2' },
                                                { label: `★★★ (${cardsAtKnowledge(3)} card)`, id: '3' },
                                                { label: `★★★★ (${cardsAtKnowledge(4)} card)`, id: '4' },
                                                { label: `★★★★★ (${cardsAtKnowledge(5)} card)`, id: '5' },
                                            ]}
                                            label="Hardnesses: "
                                            checked={values.selectedHardnessIDs}
                                            readOnly={gameStarted}
                                            onChange={(id, checked) => {
                                                if (!checked) {
                                                    arrayHelpers.push(id);
                                                    filterCardsByKnowledge([...values.selectedHardnessIDs, id]);
                                                } else {
                                                    const idx = values.selectedHardnessIDs.indexOf(id);
                                                    arrayHelpers.remove(idx);
                                                    filterCardsByKnowledge(
                                                        values.selectedHardnessIDs.filter(hardness => hardness !== id)
                                                    );
                                                }
                                            }}
                                        />
                                        <div className="selected-cards">
                                            <p className="selected-cards-info">{showingCards.length} selected cards</p>
                                        </div>
                                    </div>
                                )}
                            />

                            <Checkbox
                                handleChange={e => {
                                    setFieldValue('inverseGame', e.target.checked);
                                }}
                                name="inverseGame"
                                checked={values.inverseGame}
                                label="play with inverse cards"
                                readOnly={gameStarted}
                            />
                            {!gameStarted && showingCards.length !== 0 && (
                                <button type="submit" className="btn btn-success">
                                    Play!
                                </button>
                            )}
                        </React.Fragment>
                    );
                }}
            </Form>
        </div>
    );

    function cardsAtKnowledge(cardKnowledge: string) {
        if (!cards.length) {
            return 0;
        }
        const listOfShowingCards = cards.filter(card => cardKnowledge === card.knowledge);
        return listOfShowingCards.length;
    }
}

const RoleHints = props => {
    const [menuIsVisible, setMenuIsVisible] = useState(false);
    return (
        <ClickedOutsideChecker onOutsideClick={hideMenu}>
            <div className="role-hints-component">
                <button type="button" className="opener" onClick={toggle}>
                    <Octicon className="icon" icon={Question} />
                </button>
                <div className={'dropdown ' + (menuIsVisible ? 'show' : 'hide')}>
                    <h2 className="dropdown-title">{'user-create.user.role-hints.title'}</h2>
                    <div className="dropdown-description">
                        <h3 className="description-title">{'user-create.user.role-hints.advisor.title'}:</h3>
                        <p className="description-text">{'user-create.user.role-hints.advisor.description'}:</p>
                    </div>
                    <div className="dropdown-description">
                        <h3 className="description-title">{'user-create.user.role-hints.coach.title'}:</h3>
                        <p className="description-text">{'user-create.user.role-hints.coach.description'}</p>
                    </div>
                    <div className="dropdown-description">
                        <h3 className="description-title">
                            {'user-create.user.role-hints.organisation-manager.title'}:
                        </h3>
                        <p className="description-text">
                            {'user-create.user.role-hints.organisation-manager.description'}
                        </p>
                    </div>
                </div>
            </div>
        </ClickedOutsideChecker>
    );
    function toggle() {
        setMenuIsVisible(!menuIsVisible);
    }

    function hideMenu() {
        setMenuIsVisible(false);
    }
};
