import { FilterQuery, Model } from 'mongoose';
import { IUserRepository } from '../../../domain/users/repositories';
import { UserDocument } from '../../../data/orm/models/user';
import { UserRepositoryImpl } from '../../../data/orm/repositoryImpl/user';
import { TUser } from '../../../data/entities/user';
import { IQueryFilters } from '../../../global/entities';

// Mock the logger to prevent actual logging during tests
jest.mock('../../../utils/logger', () => ({
    logger: {
        error: jest.fn(),
    },
}));

describe('UserRepositoryImpl', () => {
    let repository: IUserRepository;
    let mockUserModel: jest.Mocked<Model<UserDocument>>;

    // Sample user data for testing
    const sampleUser: Partial<UserDocument> = {
        _id: 'user123',
        id: "user123",
        email: 'test@example.com',
        firstName: 'Test User',
        password: 'hashedPassword',
    };

    beforeEach(() => {
        // Create mock for UserModel
        mockUserModel = {
            create: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            countDocuments: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            find: jest.fn(),
        } as unknown as jest.Mocked<Model<UserDocument>>;

        repository = new UserRepositoryImpl(mockUserModel);
    });

    describe('create', () => {
        it('should create a new user successfully', async () => {
            mockUserModel.create.mockResolvedValueOnce(sampleUser as any);

            const result = await repository.create(sampleUser);

            expect(result).toEqual(sampleUser);
            expect(mockUserModel.create).toHaveBeenCalledWith(sampleUser);
        });

        it('should return null if email is missing', async () => {
            const userWithoutEmail = { ...sampleUser, email: '' };

            const result = await repository.create(userWithoutEmail);

            expect(result).toBeNull();
            expect(mockUserModel.create).not.toHaveBeenCalled();
        });

        it('should return null if creation fails', async () => {
            mockUserModel.create.mockRejectedValueOnce(new Error('Database error'));

            const result = await repository.create(sampleUser);

            expect(result).toBeNull();
        });
    });

    describe('findById', () => {
        it('should find user by id successfully', async () => {
            mockUserModel.findById.mockReturnValue({
                select: jest.fn().mockResolvedValueOnce(sampleUser),
            } as any);

            const result = await repository.findById('user123');

            expect(result).toEqual(sampleUser);
            expect(mockUserModel.findById).toHaveBeenCalledWith('user123');
        });

        it('should return null if user not found', async () => {
            mockUserModel.findById.mockReturnValue({
                select: jest.fn().mockResolvedValueOnce(null),
            } as any);

            const result = await repository.findById('nonexistent');

            expect(result).toBeNull();
        });
    });

    describe('findByEmail', () => {
        it('should find user by email successfully', async () => {
            mockUserModel.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValueOnce(sampleUser),
            } as any);

            const result = await repository.findByEmail('test@example.com');

            expect(result).toEqual(sampleUser);
            expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        });

        it('should return null if user not found', async () => {
            mockUserModel.findOne.mockReturnValue({
                select: jest.fn().mockResolvedValueOnce(null),
            } as any);

            const result = await repository.findByEmail('nonexistent@example.com');

            expect(result).toBeNull();
        });
    });

    describe('count', () => {
        it('should count users successfully', async () => {
            mockUserModel.countDocuments.mockResolvedValueOnce(10);

            const result = await repository.count();

            expect(result).toBe(10);
        });

        it('should count with filter', async () => {
            const filter: FilterQuery<TUser> = { isActive: false };
            mockUserModel.countDocuments.mockResolvedValueOnce(5);

            const result = await repository.count(filter);

            expect(result).toBe(5);
            expect(mockUserModel.countDocuments).toHaveBeenCalledWith(filter);
        });
    });

    describe('update', () => {
        it('should update user successfully', async () => {
            const updateData: Partial<TUser> = { firstName: 'Updated Name' };
            mockUserModel.findByIdAndUpdate.mockResolvedValueOnce({
                ...sampleUser,
                ...updateData,
            });

            const result = await repository.update('user123', updateData);

            expect(result).toEqual({ ...sampleUser, ...updateData });
            expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
                'user123',
                updateData,
                { new: true }
            );
        });

        it('should return null if no data provided', async () => {
            const result = await repository.update('user123', {});

            expect(result).toBeNull();
            expect(mockUserModel.findByIdAndUpdate).not.toHaveBeenCalled();
        });
    });

    describe('delete', () => {
        it('should delete user successfully', async () => {
            mockUserModel.findByIdAndDelete.mockResolvedValueOnce(sampleUser);

            const result = await repository.delete('user123');

            expect(result).toBe(true);
            expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('user123');
        });

        it('should return false if user not found', async () => {
            mockUserModel.findByIdAndDelete.mockResolvedValueOnce(null);

            const result = await repository.delete('nonexistent');

            expect(result).toBe(false);
        });
    });

    describe('query', () => {
        it('should query users with default options', async () => {
            const users = [sampleUser];
            mockUserModel.find.mockResolvedValueOnce(users);
            mockUserModel.countDocuments.mockResolvedValueOnce(1).mockResolvedValueOnce(1);

            const result = await repository.query();

            expect(result).toEqual({
                data: users,
                filterCount: 1,
                limit: 10,
                page: 1,
                totalCount: 1,
            });
            expect(mockUserModel.find).toHaveBeenCalledWith(
                {},
                { password: 0 },
                { limit: 10, skip: 0 }
            );
        });

        it('should query users with custom options', async () => {
            const users = [sampleUser];
            const options: IQueryFilters<TUser> = {
                limit: 5,
                page: 2,
                filter: { name: 'Test' },
                projection: { name: 1, email: 1 },
                queryOptions: { sort: { name: 1 } },
            };

            mockUserModel.find.mockResolvedValueOnce(users);
            mockUserModel.countDocuments.mockResolvedValueOnce(10).mockResolvedValueOnce(1);

            const result = await repository.query(options);

            expect(result).toEqual({
                data: users,
                filterCount: 1,
                limit: 5,
                page: 2,
                totalCount: 10,
            });
            expect(mockUserModel.find).toHaveBeenCalledWith(
                options.filter,
                options.projection,
                { ...options.queryOptions, limit: 5, skip: 5 }
            );
        });

        it('should return null on error', async () => {
            mockUserModel.find.mockRejectedValueOnce(new Error('Database error'));

            const result = await repository.query();

            expect(result).toBeNull();
        });
    });
});