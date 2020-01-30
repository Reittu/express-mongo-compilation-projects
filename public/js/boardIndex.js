fetch('/api/boards')
  .then(res => res.json())
  .then(boards => boards.forEach(board => updateDomWithBoard(board)));

function updateDomWithBoard(board) {
  const newBoard = document.createElement('div');
  const boardName = document.createElement('span');
  const threadCount = document.createElement('span');
  const link = document.createElement('a');
  boardName.innerText = board.name;
  threadCount.innerText = board.threadCount;
  link.href = '/b/' + board.name;
  link.text = 'visit';
  newBoard.append(boardName, threadCount, link);
  newBoard.className = 'board';
  document.querySelector('.board-container').append(newBoard);
}