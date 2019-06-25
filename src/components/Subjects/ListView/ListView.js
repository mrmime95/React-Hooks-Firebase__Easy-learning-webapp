import React from 'react';
import ListSubject from './ListSubject/ListSubject';
import './ListView.css';

export default function ListView(props: {
    data: [{ subjectName: string, id: number, packages: [{ packageName: string, id: number }] }],
    baseRoute: string,
    opened: string,
}) {
    return (
        <div className="list">
            {props.data ? (
                props.data.map((subject, index) => {
                    return (
                        <ListSubject
                            baseRoute={props.baseRoute}
                            opened={props.opened}
                            subject={subject}
                            key={`listSubject${index}`}
                        />
                    );
                })
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}
