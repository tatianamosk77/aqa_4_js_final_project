import { SalesPortalPage } from "../sales-portal.page";

export class CommentsTab extends SalesPortalPage {
  readonly uniqueElement = this.page.locator("#comments");

  readonly dataContainer = this.uniqueElement.locator("#comments-tab-container");

  readonly newCommentsTextArea = this.dataContainer.locator("#textareaComments");
  readonly createNewCommentButton = this.dataContainer.locator("#create-comment-btn");
  readonly addedCommentsContainer = this.dataContainer.locator(".shadow-sm");

  readonly deleteCommentButtonInRow = (indexOrText: number | string) =>
    this.commentRowBy(indexOrText).locator('[title="Delete"]');

  async typeComment(text: string) {
    await this.newCommentsTextArea.fill(text);
  }

  async clickCreate() {
    await this.createNewCommentButton.click();
  }

  readonly commentRowBy = (indexOrText: number | string) => {
    return typeof indexOrText === "number"
      ? this.dataContainer.locator(".shadow-sm").nth(indexOrText)
      : this.dataContainer.locator(".shadow-sm", {
          has: this.page.locator(".text-primary", { hasText: indexOrText }),
        });
  };

  async getCommentText(indexOrText: number | string): Promise<string> {
    const commentRow = this.commentRowBy(indexOrText);
    return await commentRow.locator("p").innerText();
  }

  async getCommentAuthor(indexOrText: number | string): Promise<string> {
    const commentRow = this.commentRowBy(indexOrText);
    return await commentRow.locator(".text-primary").innerText();
  }

  async getCommentDate(indexOrText: number | string): Promise<string> {
    const commentRow = this.commentRowBy(indexOrText);
    return await commentRow.locator("span:nth-child(2)").innerText();
  }

  async getCommentData(indexOrText: number | string): Promise<{
    text: string;
    author: string;
    date: string;
  }> {
    const commentRow = this.commentRowBy(indexOrText);

    const [text, author, date] = await Promise.all([
      commentRow
        .locator("p")
        .innerText()
        .catch(() => ""),
      commentRow
        .locator(".text-primary")
        .innerText()
        .catch(() => ""),
      commentRow
        .locator("span:nth-child(2)")
        .innerText()
        .catch(() => ""),
    ]);

    return {
      text: text.trim(),
      author: author.trim(),
      date: date.trim(),
    };
  }

  async getAllComments(): Promise<
    Array<{
      text: string;
      author: string;
      date: string;
    }>
  > {
    const commentRows = await this.dataContainer.locator(".shadow-sm").all();
    const comments = [];

    for (let i = 0; i < commentRows.length; i++) {
      const commentData = await this.getCommentData(i);
      comments.push(commentData);
    }

    return comments;
  }

  async clickDeleteComment(indexOrText: number | string): Promise<void> {
    const deleteButton = this.deleteCommentButtonInRow(indexOrText);
    await deleteButton.click();
  }
}
