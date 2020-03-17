(function initializeBookList() {
    const bookList = document.getElementById("book-list");
    fetch("/api/books")
        .then(res => res.json())
        .then(books =>
            books.forEach(book => {
                const bookElement = document.createElement("li");
                // HTML ids are prefixed; number is not a valid first character
                bookElement.id = "book-" + book._id;
                bookElement.className = "book-item";

                bookElement.innerHTML =
                    '<span class="book-info">' +
                    book.title +
                    ' - <span class="book-commentcount">' +
                    book.commentcount +
                    "</span> comments" +
                    "</span>";
                bookList.append(bookElement);

                const selectButton = document.createElement("button");
                selectButton.className = "btn-select";
                selectButton.innerText = "SELECT";
                selectButton.onclick = () => selectSpecificBook(book._id);
                bookElement.append(selectButton);
            })
        )
        .catch(err => console.log(err));
    //document.getElementById("delete-all").onclick = () =>
    //    genericRequest("/api/books", {}, "DELETE", () => location.reload());

    replacePostFormSubmit(
        document.getElementById("new-book-form"),
        () => ({ title: document.getElementById("new-book-title").value }),
        () => location.reload()
    );

    replacePostFormSubmit(
        document.getElementById("new-comment-form"),
        () => ({ comment: document.getElementById("new-comment-text").value }),
        () => {
            const newComment = document.createElement("li");
            newComment.className = "book-comment";
            newComment.innerText = document.getElementById("new-comment-text").value;
            document.getElementById("book-comments").append(newComment);
            const id = document.getElementById("book-title").getAttribute("data-id");
            const bookInfoElement = document.querySelector(
                "#" + id + " .book-commentcount"
            );
            bookInfoElement.innerText = Number(bookInfoElement.innerText) + 1;
        }
    );
})();

function selectSpecificBook(bookId) {
    fetch("/api/books/" + bookId)
        .then(res => res.json())
        .then(book => {
            const titleElement = document.getElementById("book-title");
            titleElement.innerHTML =
                "<strong>" + book.title + "</strong>" + " (id: " + bookId + ")";
            titleElement.setAttribute("data-id", "book-" + bookId);

            const commentContainer = document.getElementById("book-comments");

            // Remove previous comments
            while (commentContainer.lastChild) {
                commentContainer.removeChild(commentContainer.lastChild);
            }

            // Add new comments
            book.comments.forEach(comment => {
                const commentElement = document.createElement("li");
                commentElement.className = "book-comment";
                commentElement.innerText = comment;
                commentContainer.append(commentElement);
            });
            const commentForm = document.getElementById("new-comment-form");
            commentForm.action = "/api/books/" + bookId;

            document.getElementById("book-delete").onclick = () =>
                genericRequest("/api/books/" + bookId, {}, "DELETE", () => {
                    document.getElementById("book-" + bookId).remove();
                    document.getElementById("book-detail").style.display = "none";
                });
            const detail = document.getElementById("book-detail");
            detail.removeAttribute("style");
            detail.scrollIntoView();
        })
        .catch(err => alert(err));
}

function replacePostFormSubmit(form, body, callback) {
    form.onsubmit = e => {
        e.preventDefault();
        // Accepts function as body in case the body needs to be evaluated on submit
        genericRequest(
            form.action,
            typeof body === "function" ? body() : body,
            "POST",
            callback
        );
    };
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
