import React, { useContext, useState } from 'react';
import FlipCard from '../../shared/FlipCard/FlipCard';
import './CardsList.css';
const packages = [
    {
        title: 'konyha',
        id: 0,
        cards: [
            {
                front: {
                    word: 'konyha',
                    image:
                        'https://wickes.scene7.com/is/image/travisperkins/2018-Wickes-Ohio-Cream-IMG-Main-RESP?wid=824&hei=618&fit=crop',
                    example: 'A konyhaban szoktam enni',
                },
                back: {
                    word: 'kitchen',
                    image:
                        'https://www.bunnings.com.au/-/media/au/diy-advice-house/articles/kitchen/kitchen%20ideas/why-you-should-buy-a-flat-pack-kitchen/01_22_inspirationhouse_kitchen_3_header.jpg',
                    example: 'I am eating at the kitchen',
                },
            },
            {
                front: {
                    word: 'konyha',
                    image:
                        'https://wickes.scene7.com/is/image/travisperkins/2018-Wickes-Ohio-Cream-IMG-Main-RESP?wid=824&hei=618&fit=crop',
                    example: 'A konyhaban szoktam enni',
                },
                back: {
                    word: 'kitchen',
                    image:
                        'https://www.bunnings.com.au/-/media/au/diy-advice-house/articles/kitchen/kitchen%20ideas/why-you-should-buy-a-flat-pack-kitchen/01_22_inspirationhouse_kitchen_3_header.jpg',
                    example: 'I am eating at the kitchen',
                },
            },

            {
                front: {
                    word: 'konyha',
                    image:
                        'https://wickes.scene7.com/is/image/travisperkins/2018-Wickes-Ohio-Cream-IMG-Main-RESP?wid=824&hei=618&fit=crop',
                    example: 'A konyhaban szoktam enni',
                },
                back: {
                    word: 'kitchen',
                    image:
                        'https://www.bunnings.com.au/-/media/au/diy-advice-house/articles/kitchen/kitchen%20ideas/why-you-should-buy-a-flat-pack-kitchen/01_22_inspirationhouse_kitchen_3_header.jpg',
                    example: 'I am eating at the kitchen',
                },
            },
            {
                front: {
                    word: 'konyha',
                    image:
                        'https://wickes.scene7.com/is/image/travisperkins/2018-Wickes-Ohio-Cream-IMG-Main-RESP?wid=824&hei=618&fit=crop',
                    example: 'A konyhaban szoktam enni',
                },
                back: {
                    word: 'kitchen',
                    image:
                        'https://www.bunnings.com.au/-/media/au/diy-advice-house/articles/kitchen/kitchen%20ideas/why-you-should-buy-a-flat-pack-kitchen/01_22_inspirationhouse_kitchen_3_header.jpg',
                    example: 'I am eating at the kitchen',
                },
            },
            {
                front: {
                    word: 'konyha',
                    image:
                        'https://wickes.scene7.com/is/image/travisperkins/2018-Wickes-Ohio-Cream-IMG-Main-RESP?wid=824&hei=618&fit=crop',
                    example: 'A konyhaban szoktam enni',
                },
                back: {
                    word: 'kitchen',
                    image:
                        'https://www.bunnings.com.au/-/media/au/diy-advice-house/articles/kitchen/kitchen%20ideas/why-you-should-buy-a-flat-pack-kitchen/01_22_inspirationhouse_kitchen_3_header.jpg',
                    example: 'I am eating at the kitchen',
                },
            },
            {
                front: {
                    word: 'konyha',
                    image:
                        'https://wickes.scene7.com/is/image/travisperkins/2018-Wickes-Ohio-Cream-IMG-Main-RESP?wid=824&hei=618&fit=crop',
                    example: 'A konyhaban szoktam enni',
                },
                back: {
                    word: 'kitchen',
                    image:
                        'https://www.bunnings.com.au/-/media/au/diy-advice-house/articles/kitchen/kitchen%20ideas/why-you-should-buy-a-flat-pack-kitchen/01_22_inspirationhouse_kitchen_3_header.jpg',
                    example: 'I am eating at the kitchen',
                },
            },
            {
                front: {
                    word: 'konyha',
                    image:
                        'https://wickes.scene7.com/is/image/travisperkins/2018-Wickes-Ohio-Cream-IMG-Main-RESP?wid=824&hei=618&fit=crop',
                    example: 'A konyhaban szoktam enni',
                },
                back: {
                    word: 'kitchen',
                    image:
                        'https://www.bunnings.com.au/-/media/au/diy-advice-house/articles/kitchen/kitchen%20ideas/why-you-should-buy-a-flat-pack-kitchen/01_22_inspirationhouse_kitchen_3_header.jpg',
                    example: 'I am eating at the kitchen',
                },
            },
            {
                front: {
                    word: 'konyha',
                    image:
                        'https://wickes.scene7.com/is/image/travisperkins/2018-Wickes-Ohio-Cream-IMG-Main-RESP?wid=824&hei=618&fit=crop',
                    example: 'A konyhaban szoktam enni',
                },
                back: {
                    word: 'kitchen',
                    image:
                        'https://www.bunnings.com.au/-/media/au/diy-advice-house/articles/kitchen/kitchen%20ideas/why-you-should-buy-a-flat-pack-kitchen/01_22_inspirationhouse_kitchen_3_header.jpg',
                    example: 'I am eating at the kitchen',
                },
            },
            {
                front: {
                    word: 'konyha',
                    image:
                        'https://wickes.scene7.com/is/image/travisperkins/2018-Wickes-Ohio-Cream-IMG-Main-RESP?wid=824&hei=618&fit=crop',
                    example: 'A konyhaban szoktam enni',
                },
                back: {
                    word: 'kitchen',
                    image:
                        'https://www.bunnings.com.au/-/media/au/diy-advice-house/articles/kitchen/kitchen%20ideas/why-you-should-buy-a-flat-pack-kitchen/01_22_inspirationhouse_kitchen_3_header.jpg',
                    example: 'I am eating at the kitchen',
                },
            },
            {
                front: {
                    word: 'konyha',
                    image:
                        'https://wickes.scene7.com/is/image/travisperkins/2018-Wickes-Ohio-Cream-IMG-Main-RESP?wid=824&hei=618&fit=crop',
                    example: 'A konyhaban szoktam enni',
                },
                back: {
                    word: 'kitchen',
                    image:
                        'https://www.bunnings.com.au/-/media/au/diy-advice-house/articles/kitchen/kitchen%20ideas/why-you-should-buy-a-flat-pack-kitchen/01_22_inspirationhouse_kitchen_3_header.jpg',
                    example: 'I am eating at the kitchen',
                },
            },
        ],
    },
    {
        title: 'dd',
        id: 1,
        cards: [
            {
                front: {
                    word: 'fasz',
                    image: 'https://gkbcattle.com/wp-content/uploads/2017/02/DDD-One-Source-103A4-720x504.jpg',
                    example: 'A konyhaban szoktam enni',
                },
                back: {
                    word: 'dick',
                    image:
                        'https://static1.squarespace.com/static/52af6c0ee4b0324b1f660d6c/t/5b8c6cbc4d7a9cd1f8ebb270/1535927063254/DDD+Shotgun+Rider+150B+-+6x4+150.jpg',
                    example: 'I am eating at the kitchen',
                },
            },
            {
                front: {
                    word: 'fasz',
                    image: 'https://gkbcattle.com/wp-content/uploads/2017/02/DDD-One-Source-103A4-720x504.jpg',
                    example: 'A konyhaban szoktam enni',
                },
                back: {
                    word: 'dick',
                    image:
                        'https://static1.squarespace.com/static/52af6c0ee4b0324b1f660d6c/t/5b8c6cbc4d7a9cd1f8ebb270/1535927063254/DDD+Shotgun+Rider+150B+-+6x4+150.jpg',
                    example: 'I am eating at the kitchen',
                },
            },
            {
                front: {
                    word: 'fasz',
                    image: 'https://gkbcattle.com/wp-content/uploads/2017/02/DDD-One-Source-103A4-720x504.jpg',
                    example: 'A konyhaban szoktam enni',
                },
                back: {
                    word: 'dick',
                    image:
                        'https://static1.squarespace.com/static/52af6c0ee4b0324b1f660d6c/t/5b8c6cbc4d7a9cd1f8ebb270/1535927063254/DDD+Shotgun+Rider+150B+-+6x4+150.jpg',
                    example: 'I am eating at the kitchen',
                },
            },
            {
                front: {
                    word: 'fasz',
                    image: 'https://gkbcattle.com/wp-content/uploads/2017/02/DDD-One-Source-103A4-720x504.jpg',
                    example: 'A konyhaban szoktam enni',
                },
                back: {
                    word: 'dick',
                    image:
                        'https://static1.squarespace.com/static/52af6c0ee4b0324b1f660d6c/t/5b8c6cbc4d7a9cd1f8ebb270/1535927063254/DDD+Shotgun+Rider+150B+-+6x4+150.jpg',
                    example: 'I am eating at the kitchen',
                },
            },
            {
                front: {
                    word: 'fasz',
                    image: 'https://gkbcattle.com/wp-content/uploads/2017/02/DDD-One-Source-103A4-720x504.jpg',
                    example: 'A konyhaban szoktam enni',
                },
                back: {
                    word: 'dick',
                    image:
                        'https://static1.squarespace.com/static/52af6c0ee4b0324b1f660d6c/t/5b8c6cbc4d7a9cd1f8ebb270/1535927063254/DDD+Shotgun+Rider+150B+-+6x4+150.jpg',
                    example: 'I am eating at the kitchen',
                },
            },
            {
                front: {
                    word: 'fasz',
                    image: 'https://gkbcattle.com/wp-content/uploads/2017/02/DDD-One-Source-103A4-720x504.jpg',
                    example: 'A konyhaban szoktam enni',
                },
                back: {
                    word: 'dick',
                    image:
                        'https://static1.squarespace.com/static/52af6c0ee4b0324b1f660d6c/t/5b8c6cbc4d7a9cd1f8ebb270/1535927063254/DDD+Shotgun+Rider+150B+-+6x4+150.jpg',
                    example: 'I am eating at the kitchen',
                },
            },
        ],
    },
    {
        title: 'gg',
        id: 2,
        cards: [
            {
                front: {
                    word: 'itt nincs kep',
                    example: 'A konyhaban szoktam enni',
                },
                back: {
                    word: 'there is not picture',
                    example: 'I am eating at the kitchen',
                },
            },
            {
                front: {
                    word: 'itt nincs kep',
                    example: 'A konyhaban szoktam enni',
                },
                back: {
                    word: 'there is not picture',
                    example: 'I am eating at the kitchen',
                },
            },
            {
                front: {
                    word: 'itt nincs kep',
                    example: 'A konyhaban szoktam enni',
                },
                back: {
                    word: 'there is not picture',
                    example: 'I am eating at the kitchen',
                },
            },

            {
                front: {
                    word: 'itt nincs kep',
                    example: 'A konyhaban szoktam enni',
                },
                back: {
                    word: 'there is not picture',
                    example: 'I am eating at the kitchen',
                },
            },
        ],
    },
    {
        title: 'kontttttyha',
        id: 3,
        cards: [
            {
                front: {
                    word: 'itt nincs kep es szoveg',
                },
                back: {
                    word: 'there isnot picture and example',
                },
            },
            {
                front: {
                    word: 'itt nincs kep es szoveg',
                },
                back: {
                    word: 'there isnot picture and example',
                },
            },
            {
                front: {
                    word: 'itt nincs kep es szoveg',
                },
                back: {
                    word: 'there isnot picture and example',
                },
            },

            {
                front: {
                    word: 'itt nincs kep es szoveg',
                },
                back: {
                    word: 'there isnot picture and example',
                },
            },
            {
                front: {
                    word: 'itt nincs kep es szoveg',
                },
                back: {
                    word: 'there isnot picture and example',
                },
            },
            {
                front: {
                    word: 'itt nincs kep es szoveg',
                },
                back: {
                    word: 'there isnot picture and example',
                },
            },
        ],
    },
    {
        title: 'kontttttyha',
        id: 4,
        cards: [
            {
                front: {
                    word: 'itt nincs kep es szoveg',
                },
                back: {
                    word: 'there isnot picture and example',
                },
            },
            {
                front: {
                    word: 'itt nincs kep es szoveg',
                },
                back: {
                    word: 'there isnot picture and example',
                },
            },
            {
                front: {
                    word: 'itt nincs kep es szoveg',
                },
                back: {
                    word: 'there isnot picture and example',
                },
            },

            {
                front: {
                    word: 'itt nincs kep es szoveg',
                },
                back: {
                    word: 'there isnot picture and example',
                },
            },
            {
                front: {
                    word: 'itt nincs kep es szoveg',
                },
                back: {
                    word: 'there isnot picture and example',
                },
            },
            {
                front: {
                    word: 'itt nincs kep es szoveg',
                },
                back: {
                    word: 'there isnot picture and example',
                },
            },
        ],
    },
];

export default function CardsList(props: { match: RouterMatch, location: RouterLocation }) {
    return (
        <div className="cards-list">
            {props.match.params.id &&
                packages
                    .find(pack => pack.id.toString() === props.match.params.id.toString())
                    .cards.map((card, index) => {
                        return <FlipCard workWithHover front={card.front} back={card.back} key={`Flipcard${index}`} />;
                    })}
        </div>
    );
}
