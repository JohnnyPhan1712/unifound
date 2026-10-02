# Quy trình Git — Hướng dẫn thực tế

## Khi mới bắt đầu làm việc

### 1. Lần đầu clone repo

```bash
git clone <repo-url>
cd unifound
npm install
```

### 2. Cập nhật code mới nhất từ remote

```bash
git pull origin main
```

**Nếu thấy lỗi conflict:**
- Mở các file bị conflict (VS Code sẽ highlight)
- Chọn phần code muốn giữ (VS Code có nút "Accept Current Change" hoặc "Accept Incoming Change")
- Save file, sau đó:

```bash
git add .
git commit -m "resolve: merge conflict from main"
git push
```

### 3. Tạo branch để làm việc trên task mới

```bash
git checkout main
git pull origin main
git checkout -b feat/CHG-NNN-tên-task
```

Ví dụ: `feat/CHG-011-claim-flow`

## Trong khi làm việc

### Lưu thay đổi (commit)

Sau khi sửa code:

```bash
git add <file> <file> ...
# hoặc commit tất cả: git add .

git commit -m "feat(scope): mô tả rõ thay đổi là gì"
```

Ví dụ:
```bash
git commit -m "feat(claim): add claim form with verification fields"
```

### Đẩy code lên remote

```bash
git push origin feat/CHG-NNN-tên-task
```

Lần đầu push, Git yêu cầu set upstream:
```bash
git push -u origin feat/CHG-NNN-tên-task
```

## Tình huống: Có thay đổi local nhưng chưa commit, muốn pull code mới

**Trường hợp 1: Bạn muốn giữ thay đổi local (chưa sẵn sàng commit)**

```bash
git stash
git pull origin main
git stash pop
```

**Trường hợp 2: Bạn muốn hủy thay đổi local, chỉ lấy code từ remote**

> Cảnh báo: `git checkout -- .` xoá vĩnh viễn mọi thay đổi chưa commit, không khôi phục được. Chạy `git status` và chắc chắn không cần các thay đổi đó trước khi dùng.

```bash
git checkout -- .
git pull origin main
```

## Tình huống: Muốn cập nhật branch từ main (trước khi merge PR)

```bash
git fetch origin
git rebase origin/main
```

Nếu có conflict, Git sẽ báo. Giải quyết conflict như ở trên, sau đó:

```bash
git add .
git rebase --continue
git push --force-with-lease origin feat/CHG-NNN-tên-task
```

Chỉ force push (`--force-with-lease`) trên branch công việc của chính mình sau khi rebase; không bao giờ force push lên `main`.

**Tại sao rebase? Giữ lịch sử Git gọn hơn merge, dễ review hơn trong PR.**

> Tài liệu này viết cho người. AI agent không được chạy `git reset --hard`, `git checkout -- .` hoặc force push (xem `AGENTS.md`).

## Lệnh hữu ích

| Lệnh | Ý nghĩa |
|---|---|
| `git status` | Xem trạng thái file (modified, untracked, staged) |
| `git diff` | Xem chi tiết thay đổi |
| `git log --oneline` | Xem lịch sử commit |
| `git branch -a` | Xem tất cả branch (local và remote) |
| `git checkout <branch>` | Chuyển sang branch khác |
| `git reset --hard HEAD~1` | Hủy commit cuối cùng và mọi thay đổi chưa commit (không khôi phục được, cẩn thận!) |

## Quy tắc chung

- **Luôn pull từ `main` trước khi bắt đầu làm task mới**
- **Không commit file `.env`, `node_modules`, `build/` hoặc file tạm**
- **Commit message phải mô tả rõ: `feat(scope)`, `fix(scope)`, `docs(scope)` chứ không phải `update`, `fix`, `done`**
- **Nếu code bị mess, không biết cách khôi phục: hỏi trong team trước khi làm gì tiếp**
