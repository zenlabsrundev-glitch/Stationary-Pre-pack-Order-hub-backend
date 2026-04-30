import { Router } from 'express';
import { AuthController } from '../adapters/controllers/authController';
import { KitController } from '../adapters/controllers/kitController';
import { OrderController } from '../adapters/controllers/orderController';
import { UploadController } from '../adapters/controllers/uploadController';
import { UserController } from '../adapters/controllers/userController';
import { CloudinaryService } from '../infrastructure/cloudinaryService';
import { NodemailerEmailService } from '../infrastructure/emailService';
import { upload } from './middleware/upload';
import { authenticate } from './middleware/auth';
import { authorize } from './middleware/role';

// Use Cases
import { LoginUseCase } from '../application/usecases/login';
import { RegisterUseCase } from '../application/usecases/register';
import { GetKitsUseCase } from '../application/usecases/getKits';
import { CreateOrderUseCase } from '../application/usecases/createOrder';
import { UpdateOrderStatusUseCase } from '../application/usecases/updateOrderStatus';
import { SendOtpUseCase } from '../application/usecases/sendOtp';
import { VerifyOtpUseCase } from '../application/usecases/verifyOtp';
import { GetUserProfileUseCase } from '../application/usecases/getUserProfile';
import { UpdateUserProfileUseCase } from '../application/usecases/updateUserProfile';
import { GetAllUsersUseCase } from '../application/usecases/getAllUsers';
import { DeleteUserUseCase } from '../application/usecases/deleteUser';
import { CreateKitUseCase } from '../application/usecases/createKit';
import { UpdateKitUseCase } from '../application/usecases/updateKit';
import { DeleteKitUseCase, GetKitByIdUseCase } from '../application/usecases/deleteKit';
import { GetAllOrdersUseCase } from '../application/usecases/getAllOrders';
import { GetUserOrdersUseCase } from '../application/usecases/getUserOrders';
import { ResetPasswordUseCase } from '../application/usecases/resetPassword';

// Repositories
import { UserRepository } from '../adapters/repositories/userRepository';
import { KitRepository } from '../adapters/repositories/kitRepository';
import { OrderRepository } from '../adapters/repositories/orderRepository';

const router = Router();

// Infrastructure & Repositories
const userRepository = new UserRepository();
const kitRepository = new KitRepository();
const orderRepository = new OrderRepository();
const cloudinaryService = new CloudinaryService();
const emailService = new NodemailerEmailService();

// Use Cases Instantiation
const loginUseCase = new LoginUseCase(userRepository);
const registerUseCase = new RegisterUseCase(userRepository, emailService);
const sendOtpUseCase = new SendOtpUseCase(userRepository, emailService);
const verifyOtpUseCase = new VerifyOtpUseCase(userRepository);
const resetPasswordUseCase = new ResetPasswordUseCase(userRepository);

const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
const updateUserProfileUseCase = new UpdateUserProfileUseCase(userRepository);
const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
const deleteUserUseCase = new DeleteUserUseCase(userRepository);

const getKitsUseCase = new GetKitsUseCase(kitRepository);
const createKitUseCase = new CreateKitUseCase(kitRepository);
const updateKitUseCase = new UpdateKitUseCase(kitRepository);
const deleteKitUseCase = new DeleteKitUseCase(kitRepository);
const getKitByIdUseCase = new GetKitByIdUseCase(kitRepository);

const createOrderUseCase = new CreateOrderUseCase(orderRepository);
const updateStatusUseCase = new UpdateOrderStatusUseCase(orderRepository);
const getAllOrdersUseCase = new GetAllOrdersUseCase(orderRepository);
const getUserOrdersUseCase = new GetUserOrdersUseCase(orderRepository);

// Controllers
const authController = new AuthController(loginUseCase);
const userController = new UserController(getUserProfileUseCase, updateUserProfileUseCase, getAllUsersUseCase, deleteUserUseCase);
const kitController = new KitController(getKitsUseCase);
const orderController = new OrderController(createOrderUseCase);
const uploadController = new UploadController(cloudinaryService);

// ---------------- ROUTES ----------------

// Health Check - Beautiful Status Page
router.get('/', (req: any, res: any) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Stationery Hub API | Status</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap" rel="stylesheet">
        <style>
            :root {
                --primary: #6366f1;
                --secondary: #a855f7;
                --bg: #0f172a;
                --card: rgba(30, 41, 59, 0.7);
            }
            body {
                margin: 0;
                font-family: 'Outfit', sans-serif;
                background: var(--bg);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                overflow: hidden;
            }
            .background {
                position: absolute;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 40%),
                            radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.15) 0%, transparent 40%);
                z-index: -1;
            }
            .card {
                background: var(--card);
                backdrop-filter: blur(12px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                padding: 3rem;
                border-radius: 2rem;
                text-align: center;
                box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                max-width: 400px;
                width: 90%;
                animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            }
            @keyframes slideUp {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            .logo {
                font-size: 4rem;
                margin-bottom: 1rem;
                display: block;
                animation: pulse 2s infinite;
            }
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            h1 {
                margin: 0;
                font-size: 2rem;
                font-weight: 800;
                background: linear-gradient(to right, #818cf8, #c084fc);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            p {
                color: #94a3b8;
                margin: 1rem 0 2rem;
                font-size: 1.1rem;
            }
            .status-badge {
                display: inline-flex;
                align-items: center;
                background: rgba(34, 197, 94, 0.1);
                color: #4ade80;
                padding: 0.5rem 1.5rem;
                border-radius: 100px;
                font-weight: 600;
                font-size: 0.9rem;
                border: 1px solid rgba(34, 197, 94, 0.2);
            }
            .dot {
                width: 8px;
                height: 8px;
                background: #22c55e;
                border-radius: 50%;
                margin-right: 10px;
                box-shadow: 0 0 10px #22c55e;
            }
            .footer {
                margin-top: 3rem;
                font-size: 0.8rem;
                color: #475569;
            }
            .character-container {
                position: absolute;
                bottom: -20px;
                width: 100%;
                height: 100px;
                overflow: hidden;
                pointer-events: none;
            }
            .running-gif {
                height: 80px;
                position: absolute;
                animation: run 10s linear infinite;
            }
            @keyframes run {
                from { left: -150px; }
                to { left: 100%; }
            }
        </style>
    </head>
    <body>
        <div class="background"></div>
        <div class="card">
            <span class="logo">🚀</span>
            <h1>Stationery Hub</h1>
            <p>The backend API is healthy and serving requests from the cloud.</p>
            
            <div class="status-badge">
                <div class="dot"></div>
                SYSTEM ONLINE
            </div>

            <div class="character-container">
                <img src="https://media1.giphy.com/media/jyTk0vpfS0pyqkgpZu/giphy.gif" class="running-gif" alt="Tom and Jerry Running">
            </div>

            <div class="footer">
                Version 1.0.2 • Powered by Vercel & Supabase
            </div>
        </div>
    </body>
    </html>
  `);
});

// Auth Routes (Public)
router.post('/api/auth/login', (req: any, res: any) => authController.login(req, res));
router.post('/api/auth/register', (req: any, res: any) => authController.register(req, res, registerUseCase));
router.post('/api/auth/send-otp', (req: any, res: any) => authController.sendOtp(req, res, sendOtpUseCase));
router.post('/api/auth/verify-otp', (req: any, res: any) => authController.verifyOtp(req, res, verifyOtpUseCase));
router.put('/api/auth/reset-password', (req: any, res: any) => authController.resetPassword(req, res, resetPasswordUseCase));
router.post('/api/auth/admin-recovery', (req: any, res: any) => authController.adminRecovery(req, res, userRepository, emailService));

// User Routes
router.get('/api/users', authenticate, authorize(['admin']), (req: any, res: any) => userController.getAllUsers(req, res));
router.get('/api/users/:id', authenticate, (req: any, res: any) => userController.getProfile(req, res));
router.put('/api/users/:id', authenticate, (req: any, res: any) => userController.updateProfile(req, res));
router.delete('/api/users/:id', authenticate, authorize(['admin']), (req: any, res: any) => userController.deleteUser(req, res));

// Kit Routes
router.get('/api/kits', (req: any, res: any) => kitController.getAllKits(req, res));
router.get('/api/kits/:id', (req: any, res: any) => kitController.getKitById(req, res, getKitByIdUseCase));
router.post('/api/kits', authenticate, authorize(['admin']), (req: any, res: any) => kitController.createKit(req, res, createKitUseCase));
router.put('/api/kits/:id', authenticate, authorize(['admin']), (req: any, res: any) => kitController.updateKit(req, res, updateKitUseCase));
router.delete('/api/kits/:id', authenticate, authorize(['admin']), (req: any, res: any) => kitController.deleteKit(req, res, deleteKitUseCase));

// Order Routes
router.get('/api/orders', authenticate, authorize(['admin']), (req: any, res: any) => orderController.getAllOrders(req, res, getAllOrdersUseCase));
router.get('/api/orders/user/:userId', authenticate, (req: any, res: any) => orderController.getUserOrders(req, res, getUserOrdersUseCase));
router.post('/api/orders', authenticate, (req: any, res: any) => orderController.createOrder(req, res));
router.patch('/api/orders/:id/status', authenticate, authorize(['admin']), (req: any, res: any) => orderController.updateStatus(req, res, updateStatusUseCase));

// Upload Routes
router.post('/api/upload', authenticate, authorize(['admin']), upload.single('image'), (req: any, res: any) => uploadController.uploadImage(req, res));

export default router;
