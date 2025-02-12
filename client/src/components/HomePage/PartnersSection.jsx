import React from 'react';

const PartnersSection=() => {

    const gridImages = [
        [
            '/partners_image/pic1.png',
            '/partners_image/pic2.png',
            '/partners_image/pic3.png'
        ],
        [
            '/partners_image/pic4.png',
            '/partners_image/pic5.png',
            '/partners_image/pic6.png'
        ],
        [
            '/partners_image/pic7.png',
            '/partners_image/pic8.png',
            '/partners_image/pic1.png'
        ]
    ];

    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem', // space between grid items
                maxWidth: '90rem', // optional: to control overall grid size
                margin: '3rem auto' // center the grid on the page
            }}
        >
            {gridImages.map((row, rowIndex) =>
                row.map((imageSrc, colIndex) => (
                    <div
                        key={`${rowIndex}-${colIndex}`}
                        style={{
                            // border: '1px solid #ddd',
                            padding: '5px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <img
                            src={imageSrc}
                            alt={`Grid cell ${rowIndex + 1}-${colIndex + 1}`}
                            style={{width: '100%', height: 'auto'}}
                        />
                    </div>
                ))
            )}
        </div>
    );
};

export default PartnersSection;