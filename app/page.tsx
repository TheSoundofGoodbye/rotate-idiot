'use client';

import React, { useState, useEffect } from 'react';
import Image from "next/image";

//initialzie the cube
function initializeCube(size: number): any {
  // face 1 is the front face and face1 has size * size elements with coordination (0,0,0) to (0,size-1,size-1)
  let face1 = Array(size*size).fill(null).map(() => [0,0,0]);
   
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      face1[i * 10 + j] = [0, i, j];
    }
  }
  
  // // face 2 is the back face and face2 has size * size elements with coordination (size-1,0,0) to (size-1,size-1,size-1)
  // let face2 = Array(size*size).fill(null).map(() =>  
  //   Array(size).fill(null).map(() => [0,0,0])
  // );
  // for (let i = 0; i < size; i++) {
  //   for (let j = 0; j < size; j++) {
  //     face2[i][j] = [size-1, i, j];
  //   }
  // }
  
  // // face 3 is the left face and face3 has size * size elements with coordination (0,0,0) to (size-1,0,size-1)
  // let face3 = Array(size*size).fill(null).map(() =>  
  //   Array(size).fill(null).map(() => [0,0,0])
  // );
  // for (let i = 0; i < size; i++) {
  //   for (let j = 0; j < size; j++) {
  //     face3[i][j] = [i, 0, j];
  //   }
  // }

  // // face 4 is the right face and face4 has size * size elements with coordination (0,size-1,0) to (size-1,size-1,size-1)
  // let face4 = Array(size*size).fill(null).map(() =>  
  //   Array(size).fill(null).map(() => [0,0,0])
  // );
  // for (let i = 0; i < size; i++) {
  //   for (let j = 0; j < size; j++) {
  //     face4[i][j] = [i, size-1, j];
  //   }
  // }

  // // face 5 is the top face and face5 has size * size elements with coordination (0,0,0) to (size-1,size-1,0)
  // let face5 = Array(size*size).fill(null).map(() =>  
  //   Array(size).fill(null).map(() => [0,0,0])
  // );
  // for (let i = 0; i < size; i++) {
  //   for (let j = 0; j < size; j++) {
  //     face5[i][j] = [i, j, 0];
  //   }
  // }

  // // face 6 is the bottom face and face6 has size * size elements with coordination (0,0,size-1) to (size-1,size-1,size-1)
  // let face6 = Array(size*size).fill(null).map(() =>  
  //   Array(size).fill(null).map(() => [0,0,0])
  // );
  // for (let i = 0; i < size; i++) {
  //   for (let j = 0; j < size; j++) {
  //     face6[i][j] = [i, j, size-1];
  //   }
  // }

  const initialCube = [face1];
  
  return initialCube;
}

function rotateFace(face: any, axis: string, degree: number): any {
  let newFace = face;
  let radian = degree * Math.PI / 180;
  let cos = Math.cos(radian);
  let sin = Math.sin(radian);

  for (let i = 0; i < face.length; i++) {
    let x = face[i][0];
    let y = face[i][1];
    let z = face[i][2];

    if (axis === 'x') {
      newFace[i] = [x, Math.round(y * cos - z * sin), Math.round(y * sin + z * cos)];
    } else if (axis === 'y') {
      newFace[i] = [Math.round(x * cos + z * sin), y, Math.round(-x * sin + z * cos)];
    } else if (axis === 'z') {
      newFace[i] = [Math.round(x * cos - y * sin), Math.round(x * sin + y * cos), z];
    }
  }

  return newFace;
}

//rotate each face with degree
function rotateCube(size: number, degreePerMinute: number): any {
  let newCube = initializeCube(size);
  //let degreePerMinute = 6

  const [degree_x, setDegree_x] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setDegree_x(prevCount => (prevCount + 1) % 360 * degreePerMinute);
  //   }, 1000); // Update every second

  //   return () => clearInterval(interval);
  // }, []);

  //for the testing purpose, I will rotate the cube with 90 degree
  setDegree_x(90);

  //rotate the cube with time
  //rotate face1 with degree
  newCube[0] = rotateFace(newCube[0], 'x', degree_x);

  console.log(newCube);

  return newCube;
}



//Generate a 3D matrix of size x size x size and put each side of the cube in the matrix
function renderingCube(size: number): any {
  //Canvas is twice the size of the square of cubes and has 6 layers
  let canvas = Array(size*2).fill(null).map(() => 
    Array(size*2).fill(null).map(() => 
     Array(6).fill(null).map(() => 0)
    )
  );

  console.log(canvas);

  let newCanvas = Array(size*2).fill(null).map(() => 
    Array(size*2).fill(null).map(() => ' '
    )
  );

  let newCube = rotateCube(size, 6);

  let face1 = newCube[0];

  for (let i = 0; i < face1.length; i++) {

    let xcoor = face1[i][0];
    let ycoor = face1[i][1];
    let zcoor = face1[i][2];

    //put coordination in the canvas layer 1 (for face1)
    //I will compare 6 faces with the coordination and pick the highest z value and get the face number
    //each face number has unique ASCII character

    
    canvas[xcoor][ycoor][0] = zcoor; //face1
    

    //return face number that has the highest z value
    let faceNumber = 0;
    let highestZ = canvas[xcoor][ycoor][0];
    for (let i = 1; i < 6; i++) {
      if (canvas[xcoor][ycoor][i] > highestZ) {
        highestZ = canvas[xcoor][ycoor][i];
        faceNumber = i;
      }
    }

    switch (faceNumber) {
      case 0:
        newCanvas[xcoor][ycoor] = '@'
        break;
    }

  }

  return newCanvas
}

//compare 6 faces with the coordination and pick the highest z value and get the face number
function renderCanvas(size: number): string {
  let newCanvas = renderingCube(size);
  let result = '';

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      result += newCanvas[x][y] + ' ';     
    }
    result += '\n';
  }

  return result;
}

function Canvas() {
  const size = 10; // Adjust the size as needed
  const canvasArt = renderCanvas(size);

  return (
    <div style={{ lineHeight: '1.2em' }}>
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

        <Canvas/>

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
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
