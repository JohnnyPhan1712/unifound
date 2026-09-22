# Hướng dẫn cho AI Agent

1. Đọc `docs/README.md` và các file liên quan trước khi thay đổi.
2. Xem `docs/02_reports/` là nguồn phản ánh yêu cầu, thiết kế và hiện trạng đã kiểm chứng; dự kiến phải được ghi rõ là dự kiến.
3. Mỗi công việc đáng kể có đúng một hồ sơ trong `docs/01_changes/` và liên kết với một Task trên Notion.
4. Không tự chốt stack, schema, API, thuật toán matching hoặc trạng thái hoàn thành khi chưa có quyết định/bằng chứng.
5. Thực hiện thay đổi nhỏ nhất đáp ứng phạm vi; không tạo tài liệu hoặc abstraction cho nhu cầu chưa có.
6. Sau khi kiểm tra, cập nhật CHG và report liên quan trong cùng công việc.
7. Không ghi secret hoặc dữ liệu cá nhân nhạy cảm vào source, tài liệu hay prompt.
8. Mỗi CHG đáng kể dùng một branch và một pull request vào `main`; phải có owner, reviewer, file/module dự kiến sửa và dependency trước khi bắt đầu.
9. Không để nhiều Task đồng thời sửa cùng migration, schema, config hoặc cùng vùng tài liệu trung tâm nếu chưa thống nhất thứ tự; conflict phải được xử lý trên branch công việc.
10. Chỉ chuyển CHG và Notion Task sang `done` sau khi PR đã được review/merge, evidence đã ghi và report liên quan đã cập nhật.
11. AI chỉ thực hiện phạm vi của CHG hiện tại; không tự mở rộng sang hoặc hoàn thành thay phần việc thuộc CHG khác.
12. Khi dependency chưa hoàn tất, AI phải làm phần độc lập nếu có, dùng contract/mock đã thống nhất và không tự sửa file thuộc ownership của CHG khác.
13. Nếu chưa thể hoàn tất vì dependency, AI phải báo rõ CHG đang chờ, phần đã làm, phần chưa thể tích hợp và điều kiện để tiếp tục; dùng `blocked` hoặc `waiting_for_integration` thay vì `done`.
