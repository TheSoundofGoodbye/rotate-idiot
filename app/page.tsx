'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// Define the types
type Coordinate = [number, number, number];  // Coordination of each character (ASCII) in the cube
type Face = Coordinate[]; // Face of the cube, which is an array of size * size coordinates
type Cube = Face[]; // Cube is an array of 6 faces

//initialize the face of the cube
function initializeFace(size: number, faceIndex: number): Face {
  let face: Face = [];
  const halfSize = size / 2;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const x = i - halfSize + 0.5;
      const y = j - halfSize + 0.5;
      if (faceIndex === 0) {
        face.push([x, y, -halfSize + 0.5]);
      } else if (faceIndex === 1) {
        face.push([x, y, halfSize + 0.5]);
      } else if (faceIndex === 2) {
        face.push([x, -halfSize + 0.5, y]);
      } else if (faceIndex === 3) {
        face.push([x, halfSize + 0.5, y]);
      } else if (faceIndex === 4) {
        face.push([-halfSize + 0.5, x, y]);
      } else if (faceIndex === 5) {
        face.push([halfSize + 0.5, x, y]);
      }
    }
  }

  return face;
}

//initialize the cube
function initializeCube(size: number): Cube {
  const cube: Cube = [];
  for (let i = 0; i < 6; i++) {
    cube.push(initializeFace(size, i));
  }

  return cube;
}

function rotateFace(face: Coordinate[], axis: string, degree: number): Coordinate[] {
  const radian = degree * Math.PI / 180;
  const cos = Math.cos(radian);
  const sin = Math.sin(radian);
  const newFace = face.map(([x, y, z]) => {
    if (axis === 'x') {
      return [x, y * cos - z * sin, y * sin + z * cos];
    } else if (axis === 'y') {
      return [x * cos + z * sin, y, -x * sin + z * cos];
    } else if (axis === 'z') {
      return [x * cos - y * sin, x * sin + y * cos, z];
    }
    return [x, y, z];
  });
  return newFace as Coordinate[]; //newFace has size * size of new coordinations
}

function rotateCube(cube: Cube, axis: string, degree: number): Cube {
  const newCube: Cube = cube.map(face => rotateFace(face, axis, degree));
  return newCube;
}

function extractZCoordinates(cube: Cube, size: number): number[][][] {
  const canvas = Array(size * 2).fill(null).map(() =>
    Array(size * 2).fill(null).map(() =>
      Array(6).fill(-Infinity)
    )
  );

  // Extract z-axis coordinates for each face
  for (let i = 0; i < size * size; i++) {
    canvas[size + Math.round(cube[0][i][0])][size + Math.round(cube[0][i][1])][0] = cube[0][i][2]; // Front face's z-coordination
    canvas[size + Math.round(cube[1][i][0])][size + Math.round(cube[1][i][1])][1] = cube[1][i][2]; // Back face's z-coordination
    canvas[size + Math.round(cube[2][i][0])][size + Math.round(cube[2][i][1])][2] = cube[2][i][2]; // Top face's z-coordination
    canvas[size + Math.round(cube[3][i][0])][size + Math.round(cube[3][i][1])][3] = cube[3][i][2]; // Bottom face's z-coordination
    canvas[size + Math.round(cube[4][i][0])][size + Math.round(cube[4][i][1])][4] = cube[4][i][2]; // Left face's z-coordination
    canvas[size + Math.round(cube[5][i][0])][size + Math.round(cube[5][i][1])][5] = cube[5][i][2]; // Right face's z-coordination
  }

  return canvas;
}

function renderCanvas(canvas: number[][][], size: number): string {
  const canvas2D = Array(size * 2).fill(null).map(() =>
    Array(size * 2).fill(' ')
  );

  let result = '';
  // Only the highest z-coordinate is visible
  for (let i = 0; i < canvas.length; i++) {
    for (let j = 0; j < canvas[i].length; j++) {
      const maxZ = Math.max(...canvas[i][j]);
      if (maxZ === -Infinity) {
        result += ' ';
        continue;
      }

      let faceIndex = canvas[i][j].indexOf(maxZ);
      
      switch (faceIndex) {
        case 0:
          canvas2D[i][j] = '-';
          break;
        case 1:
          canvas2D[i][j] = '+';
          break;
        case 2:
          canvas2D[i][j] = '=';
          break;
        case 3:
          canvas2D[i][j] = '~';
          break;
        case 4:
          canvas2D[i][j] = '*';
          break;
        case 5:
          canvas2D[i][j] = '#';
          break;
      }
      result += canvas2D[i][j];
    }
    result += '\n';
  }

  return result;
}

function CubeComponent() {
  const size = 25; // Adjust the size as needed, prefer be an odd number
  const [cube, setCube] = useState(initializeCube(size));
  const [canvas, setCanvas] = useState(extractZCoordinates(cube, size));
  const [canvasArt, setCanvasArt] = useState(renderCanvas(canvas, size));
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouseX, setLastMouseX] = useState(0);
  const [lastMouseY, setLastMouseY] = useState(0);
  const [velocityX, setVelocityX] = useState(0);
  const [velocityY, setVelocityY] = useState(0);

  const handleMouseDown = (event: React.MouseEvent) => {
    setIsDragging(true);
    setLastMouseX(event.clientX);
    setLastMouseY(event.clientY);
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = event.clientX - lastMouseX;
    const deltaY = event.clientY - lastMouseY;

    setRotationX(prevRotationX => prevRotationX + deltaX * 0.3);
    setRotationY(prevRotationY => prevRotationY + deltaY * 0.3);

    setVelocityX(deltaY * 0.5);
    setVelocityY(deltaX * 0.5);

    setLastMouseX(event.clientX);
    setLastMouseY(event.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const newCubeX = rotateCube(cube, 'x', -rotationX);
    const newCubeY = rotateCube(newCubeX, 'y', rotationY);
    const newCanvas = extractZCoordinates(newCubeY, size);
    setCanvasArt(renderCanvas(newCanvas, size));
  }, [rotationX, rotationY, cube, size]);

  useEffect(() => {
    if (!isDragging) {
      const interval = setInterval(() => {
        setRotationX(prevRotationX => prevRotationX + velocityX);
        setRotationY(prevRotationY => prevRotationY + velocityY);

        setVelocityX(prevVelocityX => prevVelocityX * 0.95); // Apply deceleration
        setVelocityY(prevVelocityY => prevVelocityY * 0.95); // Apply deceleration

        if (Math.abs(velocityX) < 0.01 && Math.abs(velocityY) < 0.01) {
          clearInterval(interval);
        }
      }, 16); // Approximately 60 frames per second

      return () => clearInterval(interval);
    }
  }, [isDragging, velocityX, velocityY]);

  return (
    <div className="nodrag"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ lineHeight: '1em', letterSpacing: '0.2em', whiteSpace: 'pre', cursor: 'pointer' }}
    >
      <pre>
        {canvasArt}
      </pre>
    </div>
  );
}

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">

        <CubeComponent />

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Next.js
        </a>
      </footer>
    </div>
  );
}