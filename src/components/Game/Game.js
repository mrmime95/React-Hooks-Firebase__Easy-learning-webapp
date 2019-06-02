import React, { useContext } from 'react';
import GameProvider, { GameContext } from './GameProvider/GameProvider';
import { myWords } from '../../dummyData/myWords';
import Form from '../shared/Form/Form';
import MultiSelect from '../shared/MultiSelect/MultiSelect';
import Checkbox from '../shared/Checkbox/Checkbox';
import CheckboxGroup from '../shared/CheckboxGroup/CheckboxGroup';
import { FieldArray } from 'formik';
import CardGame from './CardGame/CardGame';
import CardGameProvider from './CardGame/CardGameProvider/CardGameProvider';
import './Game.css';

export default function Game(props: {}) {
    return (
        <GameProvider myWords={myWords}>
            <GameContent />
        </GameProvider>
    );
}

function GameContent(props: {}) {
    const context = useContext(GameContext);
    if (!context.gameStarted)
        return (
            <div className="search-area">
                <Form
                    initialValues={{
                        hardnessIDs: context.selectedHardnessIDs,
                        packages: context.selectedPackages,
                        subjects: context.selectedSubjects,
                    }}
                    onSubmit={values => {
                        console.log(values);
                        context.changeGameStarted();
                        context.onSubmit(values);
                    }}
                >
                    {(
                        { handleChange, handleBlur, values, setFieldValue, setFieldTouched, errors, touched },
                        FormRow
                    ) => {
                        return (
                            <React.Fragment>
                                <MultiSelect
                                    label="Selected subjects:"
                                    value={values.subjects}
                                    name="subjects"
                                    className="subjects-select"
                                    onChange={value => {
                                        handleChange({
                                            target: {
                                                name: 'subjects',
                                                value,
                                            },
                                        });
                                        context.getPackagesOfSubjects(value);
                                    }}
                                    options={
                                        context.subjects &&
                                        context.subjects.map(subject => {
                                            return { value: subject.id, label: subject.title };
                                        })
                                    }
                                    isDisabled={values.packages.length !== 0}
                                    placeholder="Select subjects"
                                />
                                <MultiSelect
                                    label="Selected packages:"
                                    value={values.packages}
                                    name="packages"
                                    className="packages-select"
                                    onChange={value => {
                                        handleChange({
                                            target: {
                                                name: 'packages',
                                                value,
                                            },
                                        });
                                        context.getCardsOfPackages(value);
                                    }}
                                    options={
                                        context.packages &&
                                        context.packages.map(pack => {
                                            return { value: pack.id, label: pack.title };
                                        })
                                    }
                                    placeholder="Select packages"
                                />
                                <FieldArray
                                    name="hardnessIDs"
                                    render={arrayHelpers => (
                                        <React.Fragment>
                                            <Checkbox
                                                handleChange={e => {
                                                    values.hardnessIDs.forEach(() => {
                                                        arrayHelpers.pop();
                                                        context.filterCardsByKnowledge([]);
                                                    });
                                                    if (e.target.checked) {
                                                        ['1', '2', '3', '4', '5'].forEach(index => {
                                                            arrayHelpers.push(index);
                                                        });
                                                        context.filterCardsByKnowledge(['1', '2', '3', '4', '5']);
                                                    }
                                                }}
                                                name="hardnessIDs"
                                                checked={values.hardnessIDs.length === 5}
                                                label={
                                                    values.hardnessIDs.length === 0
                                                        ? 'Select all hardnesses'
                                                        : `${values.hardnessIDs.length} selected`
                                                }
                                            />
                                            <CheckboxGroup
                                                checkboxes={[
                                                    { label: '1', id: '1' },
                                                    { label: '2', id: '2' },
                                                    { label: '3', id: '3' },
                                                    { label: '4', id: '4' },
                                                    { label: '5', id: '5' },
                                                ]}
                                                label="Hardnesses: "
                                                checked={values.hardnessIDs}
                                                onChange={(id, checked) => {
                                                    if (!checked) {
                                                        arrayHelpers.push(id);
                                                        context.filterCardsByKnowledge([...values.hardnessIDs, id]);
                                                    } else {
                                                        const idx = values.hardnessIDs.indexOf(id);
                                                        arrayHelpers.remove(idx);
                                                        context.filterCardsByKnowledge(
                                                            values.hardnessIDs.filter(hardness => hardness !== id)
                                                        );
                                                    }
                                                }}
                                            />
                                            <p>{context.showingCards.length} cards</p>
                                        </React.Fragment>
                                    )}
                                />
                                {!context.gameStarted && (
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
    else {
        return (
            <CardGameProvider>
                <CardGame />
            </CardGameProvider>
        );
    }
}
