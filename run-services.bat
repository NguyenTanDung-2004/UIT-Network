@echo off

echo Starting User Service...
start cmd /k "c:; cd 'c:\Users\dung.nguyen\Documents\NguyenTanDung\UIT-Network'; & 'C:\Users\dung.nguyen\.vscode\extensions\redhat.java-1.42.0-win32-x64\jre\21.0.7-win32-x86_64\bin\java.exe' '@C:\Users\DUNG~1.NGU\AppData\Local\Temp\cp_6z0k57ajdau7t8hkm2svt43s4.argfile' 'com.example.ChatService.ChatServiceApplication' "

start cmd /k "c:; cd 'c:\Users\dung.nguyen\Documents\NguyenTanDung\UIT-Network'; & 'C:\Users\dung.nguyen\.vscode\extensions\redhat.java-1.42.0-win32-x64\jre\21.0.7-win32-x86_64\bin\java.exe' '@C:\Users\DUNG~1.NGU\AppData\Local\Temp\cp_2rbsqwo7fk1dvmzx80p0ux1tg.argfile' 'com.example.UserService.UserServiceApplication'"