import { IUserRepository } from "../repository";
import { AddAddressUseCase, GetAddressesUseCase, UpdateAddressUseCase } from "./address-use-case";
import { ChangeUserRoleUseCase } from "./change-user-role";
import { ChangeUserStatusUseCase } from "./change-user-status";
import { CreateUserUseCase } from "./create-user";
import { GetUserUseCase } from "./get-user";
import { QueryUsersUseCase } from "./query-users";
import { UpdateUserUseCase } from "./update-user";

export default class UserUseCase {
    public readonly create: CreateUserUseCase
    public readonly query: QueryUsersUseCase
    public readonly get: GetUserUseCase
    public readonly changeStatus: ChangeUserStatusUseCase
    public readonly changeRole: ChangeUserRoleUseCase
    public readonly update: UpdateUserUseCase
    public readonly addAddress: AddAddressUseCase
    public readonly updateAddress: UpdateAddressUseCase
    public readonly getAddresses: GetAddressesUseCase
    constructor(private readonly userRepository: IUserRepository) {
        this.addAddress = new AddAddressUseCase(userRepository)
        this.create = new CreateUserUseCase(userRepository)
        this.query = new QueryUsersUseCase(userRepository)
        this.get = new GetUserUseCase(userRepository)
        this.changeStatus = new ChangeUserStatusUseCase(userRepository)
        this.changeRole = new ChangeUserRoleUseCase(userRepository)
        this.update = new UpdateUserUseCase(userRepository)
        this.updateAddress = new UpdateAddressUseCase(userRepository)
        this.getAddresses = new GetAddressesUseCase(userRepository)
    }
}