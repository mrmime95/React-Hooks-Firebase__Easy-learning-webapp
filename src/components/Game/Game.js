import React, { useContext, useState, useEffect } from 'react';
import GameProvider, { GameContext } from './GameProvider/GameProvider';
import { myWords } from '../../dummyData/myWords';
import Form from '../shared/Form/Form';
import MultiSelect from '../shared/MultiSelect/MultiSelect';
import AutoSubmit from '../shared/AutoSubmit/AutoSubmit';
import Checkbox from '../shared/Checkbox/Checkbox';
import CheckboxGroup from '../shared/CheckboxGroup/CheckboxGroup';
import { FieldArray } from 'formik';
import { debounce } from '../../utils';
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
    const [subjects, setSubjects] = useState([]);
    const [packages, setPackages] = useState([]);
    return (
        <div className="search-area">
            <MultiSelect
                value={subjects}
                name="subjects"
                className="subjects-select"
                onChange={values => {
                    setSubjects(values);
                    context.getPackagesOfSubjects(values);
                }}
                options={
                    context.subjects &&
                    context.subjects.map(subject => {
                        return { value: subject.id, label: subject.title };
                    })
                }
                isDisabled={packages.length !== 0}
                placeholder="Select subjects"
            />
            {subjects.length !== 0 && (
                <MultiSelect
                    value={packages}
                    name="subjects"
                    className="subjects-select"
                    onChange={values => {
                        setPackages(values);
                    }}
                    options={
                        context.packages &&
                        context.packages.map(pack => {
                            return { value: pack.id, label: pack.title };
                        })
                    }
                    placeholder="Select packages"
                />
            )}
            {/* 
            <FieldArray
                name="hardnessIDs"
                render={arrayHelpers => (
                    <React.Fragment>
                        <Checkbox
                            handleChange={e => {
                                values.hardnessIDs.forEach(() => {
                                    arrayHelpers.pop();
                                });
                                if (e.target.checked)
                                    ['1', '2', '3', '4', '5'].forEach(index => {
                                        arrayHelpers.push(index);
                                    });
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
                            checked={values.hardnessIDs}
                            onChange={(id, checked) => {
                                if (!checked) arrayHelpers.push(id);
                                else {
                                    const idx = values.hardnessIDs.indexOf(id);
                                    arrayHelpers.remove(idx);
                                }
                            }}
                        />
                    </React.Fragment>
                )}
            />
            {values.packages.length !== 0 &&
                values.subjects.length !== 0 &&
                (context.gameStarted ? (
                    <button type="button" className="btn btn-success" onClick={context.changeGameStarted}>
                        Stop!
                    </button>
                ) : (
                    <button type="button" className="btn btn-success" onClick={context.changeGameStarted}>
                        Play!
                    </button>
                ))} */}
        </div>
    );
}
