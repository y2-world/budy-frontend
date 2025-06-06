import { useState, useEffect } from 'react';
import '../styles/ImageSlider.css';

const images = ["/images/climb.jpg", "/images/pool.jpg", "/images/run.jpg", "/images/gym.jpg"];

function ImageSlider() {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % images.length);
        }, 5000); // Change image every 3 seconds
        return () => clearInterval(timer); // Cleanup on unmount
    }, []);

    return (
        <div className="slider">
            {images.map((src, i) => (
                <img
                    key={i}
                    src={src}
                    alt=""
                    className={`slide ${i === index ? 'active' : ''}`}
                />
            ))}
        </div>
    );
}

export default ImageSlider;
        