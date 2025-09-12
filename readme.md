after download git
open terminal
git config --global user.name "username"
git config --global user.email "email@example.com"

git clone <repo-url>

Tạo branch mới cho task của bạn
1. git checkout -b feature/<task-name>
vd: git checkout -b chau/product
2. ... code or do somethhing new/edit
/// cách push code 
3. git add .
4.git commit -m "do ...."
5. git push origin chau/product
6. open github web
create pull request ( bình thường sẽ có ng review nhưng ở đây bọn mình tự làm thì mình create r merge lun nha)

```` mỗi lần zo code
1. git checkout main // quay lại main
2. git pull origin main
3. git checkout chau/product // xong r quay về branch mình 
4. git merge main // để update code mới nhất vs main rồi mới code tiếp


