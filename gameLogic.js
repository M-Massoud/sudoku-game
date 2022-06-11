const loginForm = document.querySelector('.login-form');
const userName = loginForm.querySelector("input[name='user-name']");
let gameLevel = document.querySelector('select[name="game-difficulty"]');
const chooseImgsContainer = document.querySelector('.choose-images-container');
const chooseImgsSec4Group = document.querySelector('.choose-images .game-easy');
const chooseImgsSec9Group = document.querySelector('.choose-images .game-hard');
const boardTable = document.querySelector('.board-table');
const imgsTable = document.querySelector('.imgs-table');

const playerInfo = document.querySelector('.player-info');
const playername = document.querySelector('.player-name');
const playerTimer = document.querySelector('.player-timer');
const startButton = document.querySelector('.start-button');

////////////////////////////////////////

let userSolution = [];
let gameSolution;

//  to initialize the game send an api request
// the api https://sudoku-api.deta.dev/?type=4 expects the type to be either 4 or 9
const getGameData = async function (selectedGroup, gameTypeapi) {
  // get the board data and the solution from the api
  const response = await fetch(
    `https://sudoku-api.deta.dev/?type=${gameTypeapi}`
  );
  const responseData = await response.json();
  const boardData = responseData.board.split('');
  console.log(boardData);
  gameSolution = responseData.solution.split('');
  console.log(gameSolution);

  if (boardData.length == 81) {
    for (let i = 1; i <= 9; i++) {
      const tableCellImg = document.createElement('td');
      tableCellImg.innerHTML = `<img src="imgs/${selectedGroup}-${i}.png"/>
      <h4>${i}</h4>`;
      tableCellImg.style.width = '10.5%';

      imgsTable.appendChild(tableCellImg);
    }
  }

  if (boardData.length == 16) {
    for (let i = 1; i <= 4; i++) {
      const tableCellImg = document.createElement('td');
      tableCellImg.innerHTML = `<img src="imgs/${selectedGroup}-${i}.png"/> <h4>${i}</h4>`;
      imgsTable.appendChild(tableCellImg);
    }
  }

  for (let i = 0; i < boardData.length; i++) {
    const tableCell = document.createElement('td');
    tableCell.addEventListener('click', selectTableCell);

    // change the cell widht depends on the game type
    if (boardData.length == 81) {
      tableCell.style.width = '10.5%';
    }

    if (boardData.length == 16) {
      tableCell.style.width = '24%';
    }

    //   generate the board
    if (boardData[i] !== '.') {
      tableCell.innerHTML = `<img src="imgs/${selectedGroup}-${boardData[i]}.png"/>`;
    } else if (boardData[i] == '.') {
      tableCell.textContent = ' ';
    }
    boardTable.appendChild(tableCell);
  }

  // a function to check if the game is solved or not
  isGameSolved();
};

// the login form functionality
loginForm.addEventListener('submit', function (event) {
  event.preventDefault();
  loginForm.classList.add('hide');

  // choose imgs sec based on game type
  const chooseImgsSecSpecific = document.querySelector(
    `.game-${gameLevel.value}`
  );
  chooseImgsSecSpecific.classList.remove('hide');
});

// select images group
const selectBtn = document.querySelectorAll('.choose-images button');
selectBtn.forEach(btn => {
  btn.addEventListener('click', function () {
    const selectedGroup = btn.value;

    chooseImgsContainer.classList.add('hide');
    playerInfo.classList.remove('hide');
    playername.textContent = `Welcome ${userName.value}`;
    let gameType = gameLevel.value === 'easy' ? 4 : 9;
    let gameTimer = gameLevel.value === 'easy' ? 1 : 2;
    // console.log(gameType);

    boardTable.classList.add('hide');
    getGameData(selectedGroup, gameType);

    startButton.addEventListener(
      'click',
      function () {
        boardTable.classList.remove('hide');

        let time = gameTimer * 60;
        setInterval(countDown, 1000);
        function countDown() {
          let minutes = Math.floor(time / 60);
          let seconds = time % 60;
          playerTimer.innerHTML = `${minutes}: ${seconds}`;
          if (time >= 0) time--;
          else {
            alert('you lost the game');
            return;
          }
        }
      },
      { once: true }
    );
  });
});

function selectTableCell(event) {
  const selectedTableCell = this;
}

/*
to play the game with the mouse select the needed img first then choose the needed board cell
*/

// to remove the selected class from every board cell
let removeSelectedClass = function () {
  boardTable.querySelectorAll('td').forEach(cell => {
    cell.classList.remove('selected-cell');
  });
};
removeSelectedClass();

// to play the game with the mouse functionality
imgsTable.addEventListener('click', function (e) {
  let imgsSelectedTarget = e.target;

  boardTable.addEventListener('click', function (e) {
    let selectedCell = e.target.closest('td');
    // console.log(selectedCell);
    selectedCell.classList.add('selected-cell');
    let imgsSelected = `<img src="${imgsSelectedTarget.src}">`;
    selectedCell.innerHTML = imgsSelected;
  });
  isGameSolved();
});
//////////////////////////////////////////

// to play the game with the keyboard and the numbers
/*
select the cell first then choose the needed img using the numbers
*/

// move between the the board cells using the arrow keys
boardTable.addEventListener('click', function (e) {
  let currentSelectedBoardCell = e.target.closest('td');
  removeSelectedClass();

  currentSelectedBoardCell?.classList.add('selected-cell');
  document.addEventListener('keydown', function (event) {
    switch (event.key) {
      case 'ArrowLeft':
        removeSelectedClass();
        currentSelectedBoardCell = currentSelectedBoardCell?.previousSibling;
        currentSelectedBoardCell?.classList.add('selected-cell');
        break;

      case 'ArrowRight':
        removeSelectedClass();
        currentSelectedBoardCell = currentSelectedBoardCell?.nextSibling;
        currentSelectedBoardCell?.classList.add('selected-cell');
        break;

      // case 'ArrowUp':
      //   let currentSelectedBoardCellTopVal =
      //     currentSelectedBoardCell.getBoundingClientRect().top;

      //   let currentSelectedBoardCellLeftVal =
      //     currentSelectedBoardCell.getBoundingClientRect().left;

      //   console.log(currentSelectedBoardCellTopVal);

      //   currentSelectedBoardCell = document.elementFromPoint(
      //     currentSelectedBoardCellTopVal,
      //     currentSelectedBoardCellLeftVal
      //   );

      //   break;

      // case 'ArrowDown':
      //   break;
    }

    // place the img on the selected cell using key numbers
    if (document.querySelectorAll(isFinite(event.key))) {
      const selectedImgContainer =
        document.querySelectorAll('.imgs-table td')[+event.key - 1];
      if (!selectedImgContainer) return;
      selectedImg = selectedImgContainer.querySelector('img');
      if (!selectedImg) return;
      // console.log(selectedImg);

      if (currentSelectedBoardCell.classList.contains('selected-cell')) {
        const imgsSelected = `<img src="${selectedImg.src}">`;
        currentSelectedBoardCell.innerHTML = imgsSelected;
      }
      isGameSolved();
    }
  });

  // console.log('--------selctedcell--------');
  // console.log(currentSelectedBoardCell);
  // console.log('-------------------');
});

// to check if the game is solved or not

function isGameSolved() {
  userSolution = [];
  document.querySelectorAll('.board-table td').forEach(cell => {
    if (cell.querySelector('img')) {
      const img = cell.querySelector('img');
      const imgSrc = img.src + '';
      const imgNum = imgSrc.charAt(imgSrc.length - 5);
      userSolution.push(imgNum);
    } else userSolution.push('.');
  });
  // console.log('--------- user solution till now --------');
  // console.log(userSolution);
  // console.log('------------------');
  if (JSON.stringify(userSolution) === JSON.stringify(gameSolution)) {
    alert('congratulations you are a genius');
    const answer = window.confirm('Do you want to play again?');
    if (answer) {
      // getGameData();
    } else {
      location.reload();
    }
  }
}
