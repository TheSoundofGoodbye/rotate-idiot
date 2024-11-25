import Image from "next/image";

//Canvas is twice the size of the square of cubes
function generateCanvas(size: number): number[][] {
  const canvas = Array(size * 2).fill(null).map(() => Array(size * 2).fill(0));
  return canvas;
}

//Generate a 3D matrix of size x size x size and put each side of the cube in the matrix
function generate3DMatrix(size: number): any {
  // face 1 is the front face and face1 has size * size elements with coordination (0,0,0) to (0,size-1,size-1)
  let face1 = Array(size*size).fill(null).map(() =>  
    Array(size).fill(null).map(() => [0,0,0])
  );
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      face1[i][j] = [0, i, j];
    }
  }

  // face 2 is the back face and face2 has size * size elements with coordination (size-1,0,0) to (size-1,size-1,size-1)
  let face2 = Array(size*size).fill(null).map(() =>  
    Array(size).fill(null).map(() => [0,0,0])
  );
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      face2[i][j] = [size-1, i, j];
    }
  }
  
  // face 3 is the left face and face3 has size * size elements with coordination (0,0,0) to (size-1,0,size-1)
  let face3 = Array(size*size).fill(null).map(() =>  
    Array(size).fill(null).map(() => [0,0,0])
  );
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      face3[i][j] = [i, 0, j];
    }
  }

  // face 4 is the right face and face4 has size * size elements with coordination (0,size-1,0) to (size-1,size-1,size-1)
  let face4 = Array(size*size).fill(null).map(() =>  
    Array(size).fill(null).map(() => [0,0,0])
  );
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      face4[i][j] = [i, size-1, j];
    }
  }

  // face 5 is the top face and face5 has size * size elements with coordination (0,0,0) to (size-1,size-1,0)
  let face5 = Array(size*size).fill(null).map(() =>  
    Array(size).fill(null).map(() => [0,0,0])
  );
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      face5[i][j] = [i, j, 0];
    }
  }

  // face 6 is the bottom face and face6 has size * size elements with coordination (0,0,size-1) to (size-1,size-1,size-1)
  let face6 = Array(size*size).fill(null).map(() =>  
    Array(size).fill(null).map(() => [0,0,0])
  );
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      face6[i][j] = [i, j, size-1];
    }
  }


}

//
function render3DMatrix(matrix: number[][][]): string {
  const size = matrix.length;
  let result = '';

  for (let z = 0; z < size; z++) {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        result += matrix[z][y][x] + ' ';
      }
      result += '\n';
    }
    result += '\n';
  }

  return result;
}


function generateSquare(size: number): string {
  let square = "";
  const line = "@".repeat(size * 2) + "\n";
  for (let i = 0; i < size; i++) {
    square += line;
  }
  return square;
}

function Square() {
  const size = 20; // Adjust the size as needed
  const squareArt = generateSquare(size);

  return (
    <div style={{ lineHeight: '1.2em' }}>
      <pre>
        {squareArt}
      </pre>
    </div>
  );
}


export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">

        <Square/>

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
