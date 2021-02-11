import { useReducer } from "react";
import styled from "styled-components";

const borderWidth = 4;

const Container = styled.div`
  padding: 0.5rem;
`;

const Title = styled.h1`
  text-align: center;
`;

const Table = styled.table`
  border-collapse: collapse;
  margin: 0 auto;
`;

const GameSqaure = styled.td`
  width: 100px;
  height: 100px;
  cursor: pointer;

  border-width: ${borderWidth}px;
  border-color: black;
  border-top-style: ${({ fill }) => (fill[0] === "e" ? "dotted" : "solid")};
  border-right-style: ${({ fill }) => (fill[1] === "e" ? "dotted" : "solid")};
  border-bottom-style: ${({ fill }) => (fill[2] === "e" ? "dotted" : "solid")};
  border-left-style: ${({ fill }) => (fill[3] === "e" ? "dotted" : "solid")};

  background-color: ${({ winner }) =>
    winner === "u" ? "transparent" : winner === "b" ? "blue" : "red"};
`;

const squares = Array.from({ length: 6 }, () =>
  Array.from({ length: 6 }, () => ["e", "e", "e", "e", "u"])
);

const initialState = {
  currentPlayer: "b",
  squares,
};

const checkForWinner = (squares, row, column, player) => {
  let newPlayer = player === "b" ? "r" : "b";

  if (
    squares[row][column][0] === "f" &&
    squares[row][column][1] === "f" &&
    squares[row][column][2] === "f" &&
    squares[row][column][3] === "f"
  ) {
    squares[row][column][4] = player;
    newPlayer = player;
  }

  return { squares, player: newPlayer };
};

const reducer = (state, action) => {
  let newSquares = [...state.squares];
  let newData = {};

  switch (action.type) {
    case "fill_in":
      newSquares[action.row][action.column][action.position] = "f";

      // handle clicking the top border
      if (action.position === 0 && action.row !== 0) {
        newSquares[action.row - 1][action.column][2] = "f";

        newData = checkForWinner(
          newSquares,
          action.row - 1,
          action.column,
          state.currentPlayer
        );
      }
      // handle clicking the bottom border
      if (action.position === 2 && action.row !== state.squares.length - 1) {
        newSquares[action.row + 1][action.column][0] = "f";

        newData = checkForWinner(
          newSquares,
          action.row + 1,
          action.column,
          state.currentPlayer
        );
      }
      // handle clicking the left border
      if (action.position === 3 && action.column !== 0) {
        newSquares[action.row][action.column - 1][1] = "f";

        newData = checkForWinner(
          newSquares,
          action.row,
          action.column - 1,
          state.currentPlayer
        );
      }
      // handle clicking the right border
      if (
        action.position === 1 &&
        action.column !== state.squares[action.row].length - 1
      ) {
        newSquares[action.row][action.column + 1][3] = "f";

        newData = checkForWinner(
          newSquares,
          action.row,
          action.column + 1,
          state.currentPlayer
        );
      }

      newData = checkForWinner(
        newSquares,
        action.row,
        action.column,
        state.currentPlayer
      );

      return {
        ...state,
        currentPlayer: newData.player,
        squares: newData.squares,
      };

    default:
      throw new Error();
  }
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fillIn = (event, row, column) => {
    const bubble = 4;
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    let position = -1;

    if (x <= borderWidth + bubble) {
      //left
      position = 3;
    }
    if (x >= event.target.clientWidth - bubble) {
      // right
      position = 1;
    }
    if (y <= borderWidth + bubble) {
      //top
      position = 0;
    }
    if (y >= event.target.clientWidth - bubble) {
      //bottom
      position = 2;
    }

    if (position > -1) {
      dispatch({ type: "fill_in", position, row, column });
    }
  };

  const { squares } = state;

  return (
    <Container>
      <Title>
        Current Player: {state.currentPlayer === "b" ? "Blue" : "Red"}
      </Title>
      <Table>
        <tbody>
          {squares.map((square, tr_index) => (
            <tr key={tr_index}>
              {square.map((box, td_index) => (
                <GameSqaure
                  key={td_index}
                  onClick={(event) => fillIn(event, tr_index, td_index)}
                  fill={box}
                  winner={box[4]}
                />
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default App;
