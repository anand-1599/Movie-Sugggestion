import React from 'react';
import { loadFull } from 'tsparticles';
import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import styled from 'styled-components';

const ParticlesWrapper = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
`;

const ParticlesBackground = () => {
    const particlesInit = useCallback(async (engine) => {
        await loadFull(engine);
    }, []);

    return (
        <ParticlesWrapper>
            <Particles
                id="tsparticles"
                init={particlesInit}
                options={{
                    background: {
                        color: {
                            value: "#0d47a1",
                        },
                    },
                    fpsLimit: 60,
                    particles: {
                        number: {
                            value: 100,
                        },
                        size: {
                            value: 3,
                        },
                        move: {
                            speed: 1,
                        },
                        links: {
                            enable: true,
                            color: "#ffffff",
                            distance: 150,
                        },
                    },
                    interactivity: {
                        events: {
                            onHover: {
                                enable: true,
                                mode: "repulse",
                            },
                            onClick: {
                                enable: true,
                                mode: "push",
                            },
                        },
                        modes: {
                            repulse: {
                                distance: 100,
                            },
                            push: {
                                quantity: 4,
                            },
                        },
                    },
                }}
            />
        </ParticlesWrapper>
    );
};

export default ParticlesBackground;
