(function initializePage() {
  // Get rids of unnecessary slashes at the end of url
  const cleanedUrl = location.href.replace(/\/$/, "");
  const splitUrl = cleanedUrl.split("/");
  const threadId = splitUrl[splitUrl.length - 1].replace(/\?.*$/, "");
  const boardName = splitUrl[splitUrl.length - 2];

  document.querySelector(".thread-header").innerText +=
    boardName + "/" + threadId;
  document.querySelector("#reply-form").action += boardName;
  document.querySelector("#thread-id").value = threadId;

  fetch("/api/replies/" + boardName + "?thread_id=" + threadId)
    .then(res => res.json())
    .then(thread => {
      if (typeof thread !== "object")
        return (document.location.href = document.location.href.match(
          /^.*?b\/\w+/
        )[0]);
      updateDomWithThread(thread, boardName);
    })
    .catch(err => console.log(err));
})();

// thread: { _id, text, created_on, bumped_on, replies: [{_id, text, created_on}] }
function updateDomWithThread(threadObj, boardName) {
  const threadContainer = document.querySelector(".thread-container");

  const thread = createGenericElement("div", "thread");
  threadContainer.append(thread);

  // First post of the thread (creator)
  const threadMain = createGenericElement("div", "thread-main");
  const threadInfo = createGenericElement("div", "post-info");
  const postId = createGenericElement("span", "post-id", threadObj._id);
  const postDate = createGenericElement(
    "span",
    "post-date",
    new Date(threadObj.created_on).toGMTString()
  );

  const deleteButton = createGenericElement(
    "button",
    "btn btn-delete",
    "DELETE"
  );
  deleteButton.onclick = event => {
    event.stopPropagation();
    deletePostRequest(
      "/api/threads/" + boardName,
      {
        thread_id: threadObj._id
      },
      event
    );
  };

  const reportButton = createGenericElement(
    "button",
    "btn btn-report",
    "REPORT"
  );
  reportButton.onclick = e => {
    e.stopPropagation();
    reportPostRequest("/api/threads/" + boardName, {
      thread_id: threadObj._id
    });
  };

  threadInfo.append(postId, postDate, deleteButton, reportButton);

  const threadText = createGenericElement("p", "post-text", threadObj.text);
  threadMain.append(threadInfo, threadText);
  thread.append(threadMain);

  for (let i = 0; i < threadObj.replies.length; i++) {
    const reply = createGenericElement("div", "thread-reply");
    const replyInfo = createGenericElement("div", "post-info");
    const postId = createGenericElement(
      "span",
      "post-id",
      threadObj.replies[i]._id
    );
    const postDate = createGenericElement(
      "span",
      "post-date",
      new Date(threadObj.replies[i].created_on).toGMTString()
    );

    const deleteButton = createGenericElement(
      "button",
      "btn btn-delete",
      "DELETE"
    );
    deleteButton.onclick = event => {
      event.stopPropagation();
      deletePostRequest(
        "/api/replies/" + boardName,
        { reply_id: threadObj.replies[i]._id },
        event
      );
    };

    const reportButton = createGenericElement(
      "button",
      "btn btn-report",
      "REPORT"
    );
    reportButton.onclick = event => {
      event.stopPropagation();
      reportPostRequest("/api/replies/" + boardName, {
        reply_id: threadObj.replies[i]._id
      });
    };

    replyInfo.append(postId, postDate, deleteButton, reportButton);

    const replyText = createGenericElement(
      "p",
      "post-text",
      threadObj.replies[i].text
    );

    reply.append(replyInfo, replyText);
    thread.append(reply);
  }
}

function createGenericElement(elementType, className, innerText) {
  const element = document.createElement(elementType);
  if (className) element.className = className;
  if (innerText) element.innerText = innerText;
  return element;
}

function deletePostRequest(url, body, event) {
  console.log(event);
  const password = prompt("Enter the delete password");
  if (password) {
    fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body, password })
    })
      .then(res => res.json())
      .then(res => {
        if (res === "success")
          event.target.parentElement.parentElement.querySelector(
            ".post-text"
          ).innerText = "[deleted]";
        alert(res);
      })
      .catch(err => alert(err));
  }
}

function reportPostRequest(url, body) {
  if (confirm("Report this post?")) {
    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(res => alert(res))
      .catch(err => alert(err));
  }
}
