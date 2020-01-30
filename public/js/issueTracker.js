const issueUrl =
  "/api/issues/" + document.getElementById("project-name").innerText;

function handleSubmit(event, method) {
  event.preventDefault();
  let body = {};
  // Ignore form's last child (submit)
  for (let i = 0; i < event.target.children.length - 1; i++) {
      const key = event.target.children[i].name;
      const value = event.target.children[i].value;
      if(value !== "") body[key] = value;
  }
  genericRequest(issueUrl, body, method, () => location.reload());
}

function handleEdit(id) {
  document.getElementById("edit-issue-id").value = id;
  const editForm = document.getElementById("edit-issue-form");
  editForm.scrollIntoView();
  editForm.children[1].focus();
}


function handleStatusToggle(id, newState) {
  genericRequest(issueUrl, { id, open: newState }, "PUT", () => {
    const issueContainer = document.getElementById("issue-" + id);
    if (newState === false) {
      issueContainer.style.opacity = "0.2";
      issueContainer.querySelector(".issue-status").innerText = "closed";
    } else {
      issueContainer.removeAttribute("style");
      issueContainer.querySelector(".issue-status").innerText = "open";
    }
    const statusButton = issueContainer.querySelector(".btn-status-toggle");
    statusButton.innerText = newState ? "CLOSE" : "OPEN";
    statusButton.onclick = () => handleStatusToggle(id, !newState);
  });
}

function handleDelete(id) {
  genericRequest(issueUrl, { id }, "DELETE", () =>
    document.getElementById("issue-" + id).remove()
  );
}

function genericRequest(url, body, method, callback) {
  if (method === "DELETE" && !confirm("Proceed with deletion?")) return;
  fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
    .then(res => res.json())
    .then(res => (callback ? callback(res) : null))
    .catch(err => alert(err));
}
