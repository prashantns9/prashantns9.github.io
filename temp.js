let tableDom = document.querySelector("#data-table");

function renderTable(data) {
  data.forEach((person) => {
    let row = document.createElement("tr");
    let nameCol = document.createElement("td");
    nameCol.textContent = person.name;
    row.appendChild(nameCol);
    let ageCol = document.createElement("td");
    ageCol.textContent = person.age;
    row.appendChild(ageCol);
    let subCol = document.createElement("td");
    subCol.textContent = person.subject;
    row.appendChild(subCol);
    tableDom.appendChild(row);
  });
}

async function main() {
  let response = await fetch("https://www.prashantshinde.in/assets/data.json");
  let data = await response.json();
  console.log(data);

  renderTable(data);
}

main();
