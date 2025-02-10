import { IVendorRepository } from "../repository";
import { CreateVendorUseCase } from "./create-vendor";
import { DeleteVendorUseCase } from "./delete-vendor";
import { GetVendorUseCase } from "./get-vendor";
import { QueryVendorsUseCase } from "./query-vendors";
import { UpdateVendorUseCase } from "./update-vendor-profile";
import { VerifyVendorUseCase } from "./verify-vendor";

export default class VendorUseCase {
    public readonly create: CreateVendorUseCase
    public readonly query: QueryVendorsUseCase
    public readonly get: GetVendorUseCase
    public readonly updateProfile: UpdateVendorUseCase
    public readonly verify: VerifyVendorUseCase
    public readonly delete: DeleteVendorUseCase
    constructor(private readonly vendorRepository: IVendorRepository) {
        this.create = new CreateVendorUseCase(vendorRepository)
        this.get = new GetVendorUseCase(vendorRepository)
        this.query = new QueryVendorsUseCase(vendorRepository)
        this.updateProfile = new UpdateVendorUseCase(vendorRepository)
        this.verify = new VerifyVendorUseCase(vendorRepository)
        this.delete = new DeleteVendorUseCase(vendorRepository)
    }
}