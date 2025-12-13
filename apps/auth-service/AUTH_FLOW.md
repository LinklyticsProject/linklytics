# Authentication Flow อธิบาย

## 🔄 Flow การทำงานของ JWT Authentication

### 1. **Login Process** (สร้าง Token)

```
Client → POST /login
  ↓
AuthService.loginUser()
  ↓
ตรวจสอบ email/password
  ↓
JwtService.signAsync() → สร้าง JWT token
  ↓
Return { accessToken, user }
```

### 2. **Protected Route Access** (ใช้ Token)

```
Client → GET /profile
  Header: Authorization: Bearer <token>
  ↓
JwtAuthGuard ถูกเรียก
  ↓
JwtStrategy.validate()
  ├─ Extract token จาก header
  ├─ Decode & verify token
  ├─ ดึง user จาก database
  └─ ใส่ user ใน request.user
  ↓
ถ้า valid → ผ่านไปยัง Controller
ถ้า invalid → throw UnauthorizedException
  ↓
Controller.getProfile()
  ↓
@CurrentUser() decorator ดึง user จาก request.user
  ↓
Return user data
```

## 📁 โครงสร้างไฟล์

### **Strategies** (`auth/strategies/jwt.strategy.ts`)

- **หน้าที่**: ตรวจสอบและ validate JWT token
- **ทำงาน**:
  - Extract token จาก Authorization header
  - Decode และ verify token
  - ดึงข้อมูล user จาก database
  - Return user object

### **Guards** (`auth/guards/jwt-auth.guard.ts`)

- **หน้าที่**: ป้องกัน route ที่ต้อง authentication
- **ทำงาน**:
  - เรียกใช้ JWT Strategy
  - ถ้า token ไม่ valid → block request
  - ถ้า valid → อนุญาตให้ผ่าน

### **Decorators** (`auth/decorators/current-user.decorator.ts`)

- **หน้าที่**: ดึง user object จาก request
- **ทำงาน**:
  - ดึง `request.user` ที่ Strategy ใส่ไว้
  - Return เป็น typed object

## 💡 ตัวอย่างการใช้งาน

### 1. Public Route (ไม่ต้อง login)

```typescript
@Post('register')
async registerUser(@Body() dto: RegisterUserDto) {
  // ไม่มี @UseGuards → ทุกคนเข้าถึงได้
}
```

### 2. Protected Route (ต้อง login)

```typescript
@Get('profile')
@UseGuards(JwtAuthGuard)  // ← ต้องมี token
getProfile(@CurrentUser() user: UserResponseDto) {
  // user ถูก inject อัตโนมัติจาก token
  return user;
}
```

### 3. Multiple Guards

```typescript
@Delete('account')
@UseGuards(JwtAuthGuard, AdminGuard)  // ← ต้อง login + เป็น admin
deleteAccount(@CurrentUser() user: UserResponseDto) {
  // ...
}
```

## 🔐 Security Features

1. **Token Expiration**: Token หมดอายุใน 15 นาที (ตั้งใน TokenModule)
2. **Secret Key**: ใช้ JWT_SECRET จาก environment variable
3. **User Validation**: ตรวจสอบว่า user ยังมีอยู่ใน database
4. **Type Safety**: ใช้ TypeScript types ทุกที่

## 📝 สรุป

- **Strategy** = ตรวจสอบ token และดึง user
- **Guard** = ป้องกัน route
- **Decorator** = ดึง user object สะดวกๆ

ทั้งหมดนี้ทำงานร่วมกันเพื่อให้ authentication ปลอดภัยและใช้งานง่าย!
