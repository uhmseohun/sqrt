import React, { useState } from 'react';
import styled from 'styled-components';
import FunctionCanvas from './components/FunctionCanvas';
import ControlBox from './components/ControlBox';
import swal from 'sweetalert';
import * as utils from './App.Utils';
import { compile, rationalize } from 'mathjs';

const App = () => {
  const [funcs, setFuncs] = useState([]);
  const [scale, setScale] = useState(60);

  const process = async (equationString, number, speed, diffMax) => {
    const equation = compile(equationString);
    setFuncs([equation]);
    const { coefficients } = rationalize(equationString, {}, true);
    const derivFunc = utils.getDerivativeFunc(coefficients);

    let currPos = 1, i;

    for (i = 0; diffMax < Math.abs(currPos ** 2 - number); i += 1) {
      // eslint-disable-next-line
      const slope = derivFunc.evaluate({ x: currPos });
      const fValue = equation.evaluate({ x: currPos });
      const tangent = compile(`${slope}(x - ${currPos}) + ${fValue}`);
      setFuncs([equation, tangent]);
      await utils.sleep(speed);
      currPos = utils.getNextPosition(equation, derivFunc, currPos);
    }

    const result = currPos;
    swal('근삿값 찾았어요!', `${i}번 시행했을 때 ${number}의 양의 제곱근의 근삿값은 '${result}'입니다!`);
  }

  return (
    <Container>
      <FunctionCanvas
        funcs={funcs}
        scale={scale}
      />
      <ControlBox
        onButtonClick={async ({ number, speed, diffMax }) => {
          const equationString = `x^2 - ${number}`;
          await process(equationString, number, speed, diffMax);
        }}
        onScaleChanged={(_scale) => setScale(_scale)}
      />
    </Container>
  );
}

export default App;

const Container = styled.main`
  position: relative;
`;
