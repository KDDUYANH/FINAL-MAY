@echo off
chcp 65001 > nul
echo ========================================================
echo   MÂY IMAGE STUDIO — DEPLOY GOOGLE CLOUD RUN
echo ========================================================
echo.

echo [1/3] Kiểm tra và build production bundle...
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Build thất bại! Vui lòng kiểm tra lỗi code.
    pause
    exit /b %errorlevel%
)

echo.
echo [2/3] Xác thực tài khoản Google Cloud...
call gcloud auth login --brief
if %errorlevel% neq 0 (
    echo [ERROR] Đăng nhập Google Cloud thất bại.
    pause
    exit /b %errorlevel%
)

echo.
echo [3/3] Triển khai lên Cloud Run (Project: app-test-503004, Region: asia-southeast1)...
call gcloud run deploy may-image-studio ^
    --source . ^
    --region asia-southeast1 ^
    --platform managed ^
    --allow-unauthenticated ^
    --project app-test-503004

echo.
echo ========================================================
echo   HOÀN TẤT TRIỂN KHAI!
echo ========================================================
pause
