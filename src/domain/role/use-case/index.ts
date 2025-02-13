import { IRoleRepository } from "../repository";
import { CreateRoleUseCase } from "./create-role";
import { GetRoleUseCase } from "./get-role";
import { QueryRolesUseCase } from "./query-roles";
import { UpdateRolePermissionsUseCase } from "./update-role-permissions";
import { DeleteRoleUseCase } from "./delete-role"

export default class RoleUseCase {
    public readonly create: CreateRoleUseCase;
    public readonly get: GetRoleUseCase;
    public readonly query: QueryRolesUseCase;
    public readonly update: UpdateRolePermissionsUseCase;
    public readonly delete: DeleteRoleUseCase;

    constructor(private readonly roleRepository: IRoleRepository) {
        this.create = new CreateRoleUseCase(this.roleRepository);
        this.get = new GetRoleUseCase(this.roleRepository);
        this.query = new QueryRolesUseCase(this.roleRepository);
        this.update = new UpdateRolePermissionsUseCase(this.roleRepository);
        this.delete = new DeleteRoleUseCase(this.roleRepository);
    }
}
