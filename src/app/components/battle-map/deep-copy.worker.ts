/// <reference lib="webworker" />

addEventListener('message', ({ data }) => {
  let createdArray = [];
  for (let j = 0; j < data.size[0]; j++) {
    let row = [];
    for (let i = 0; i < data.size[1]; i++) {
      row.push({
        type: 'air',
      });
    }
    createdArray.push(row);
  }
  postMessage(createdArray);
});
