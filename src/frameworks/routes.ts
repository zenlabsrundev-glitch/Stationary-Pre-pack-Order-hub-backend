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

// Auth Routes (Public)
router.post('/auth/login', (req: any, res: any) => authController.login(req, res));
router.post('/auth/register', (req: any, res: any) => authController.register(req, res, registerUseCase));
router.post('/auth/send-otp', (req: any, res: any) => authController.sendOtp(req, res, sendOtpUseCase));
router.post('/auth/verify-otp', (req: any, res: any) => authController.verifyOtp(req, res, verifyOtpUseCase));
router.put('/auth/reset-password', (req: any, res: any) => authController.resetPassword(req, res, resetPasswordUseCase));
router.post('/auth/admin-recovery', (req: any, res: any) => authController.adminRecovery(req, res, userRepository, emailService));

// User Routes
router.get('/users', authenticate, authorize(['admin']), (req: any, res: any) => userController.getAllUsers(req, res));
router.get('/users/:id', authenticate, (req: any, res: any) => userController.getProfile(req, res));
router.put('/users/:id', authenticate, (req: any, res: any) => userController.updateProfile(req, res));
router.delete('/users/:id', authenticate, authorize(['admin']), (req: any, res: any) => userController.deleteUser(req, res));

// Kit Routes
router.get('/kits', (req: any, res: any) => kitController.getAllKits(req, res));
router.get('/kits/:id', (req: any, res: any) => kitController.getKitById(req, res, getKitByIdUseCase));
router.post('/kits', authenticate, authorize(['admin']), (req: any, res: any) => kitController.createKit(req, res, createKitUseCase));
router.put('/kits/:id', authenticate, authorize(['admin']), (req: any, res: any) => kitController.updateKit(req, res, updateKitUseCase));
router.delete('/kits/:id', authenticate, authorize(['admin']), (req: any, res: any) => kitController.deleteKit(req, res, deleteKitUseCase));

// Order Routes
router.get('/orders', authenticate, authorize(['admin']), (req: any, res: any) => orderController.getAllOrders(req, res, getAllOrdersUseCase));
router.get('/orders/user/:userId', authenticate, (req: any, res: any) => orderController.getUserOrders(req, res, getUserOrdersUseCase));
router.post('/orders', authenticate, (req: any, res: any) => orderController.createOrder(req, res));
router.patch('/orders/:id/status', authenticate, authorize(['admin']), (req: any, res: any) => orderController.updateStatus(req, res, updateStatusUseCase));

// Upload Routes
router.post('/upload', authenticate, authorize(['admin']), upload.single('image'), (req: any, res: any) => uploadController.uploadImage(req, res));

export default router;
