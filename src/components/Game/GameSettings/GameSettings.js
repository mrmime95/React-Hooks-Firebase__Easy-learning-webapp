import React, { useContext } from 'react';
import { GameContext } from '../GameProvider/GameProvider';
import Form from '../../shared/Form/Form';
import MultiSelect from '../../shared/MultiSelect/MultiSelect';
import CheckboxGroup from '../../shared/CheckboxGroup/CheckboxGroup';
import { FieldArray } from 'formik';
import './GameSettings.css';
export default function GameSettings(props: {}) {
    const context = useContext(GameContext);
    return (
        <div className="game-settings">
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
                {({ handleChange, handleBlur, values, setFieldValue, setFieldTouched, errors, touched }, FormRow) => {
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
                                isDisabled={values.hardnessIDs.length !== 0}
                                placeholder="Select packages"
                            />
                            <FieldArray
                                name="hardnessIDs"
                                render={arrayHelpers => (
                                    <React.Fragment>
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
                                            readOnly={values.packages.length === 0 || values.subjects.length === 0}
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
}
