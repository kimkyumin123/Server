-- CreateTable
CREATE TABLE "_CommentToHashTag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CommentToHashTag_AB_unique" ON "_CommentToHashTag"("A", "B");

-- CreateIndex
CREATE INDEX "_CommentToHashTag_B_index" ON "_CommentToHashTag"("B");

-- AddForeignKey
ALTER TABLE "_CommentToHashTag" ADD FOREIGN KEY ("A") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CommentToHashTag" ADD FOREIGN KEY ("B") REFERENCES "HashTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
