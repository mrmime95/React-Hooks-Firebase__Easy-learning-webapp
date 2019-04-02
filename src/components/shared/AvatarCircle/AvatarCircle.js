import React from 'react';
import { monogram } from '../../../utils';
import './AvatarCircle.css';

export default function AvatarCircle(props: { fullName: string, onClick?: () => void, profilePicture?: string }) {
    return (
        <div className={`avatar-circle ${!props.profilePicture && 'red'}`} onClick={props.onClick}>
            <span className="monogram">{monogram(props.fullName)}</span>
            {props.profilePicture && (
                <img className="profile-picture" src={props.profilePicture} alt={props.fullName} />
            )}
        </div>
    );
}
