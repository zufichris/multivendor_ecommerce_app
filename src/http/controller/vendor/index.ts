import { Request, Response, NextFunction } from "express";
import { VendorRepositoryImpl } from "../../../data/orm/repository-implementation/vendor";
import { VendorModel } from "../../../data/orm/model/vendor";
import { CreateVendorUseCase } from "../../../domain/vendor/use-case/create-vendor";
import { QueryVendorsUseCase } from "../../../domain/vendor/use-case/query-vendors";
import { GetVendorUseCase } from "../../../domain/vendor/use-case/get-vendor";
import { UpdateVendorUseCase } from "../../../domain/vendor/use-case/update-vendor-profile";
import { VerifyVendorUseCase } from "../../../domain/vendor/use-case/verify-vendor";
import { DeleteVendorUseCase } from "../../../domain/vendor/use-case/delete-vendor";
import { validateData } from "../../../util/functions";
import { EStatusCodes } from "../../../global/enum";
import { TVendor } from "../../../data/entity/vendor";
import { IQueryFilters, IResponseData, IResponseDataPaginated } from "../../../global/entity";
import { CreateVendorDTO, CreateVendorSchema, UpdateVendorDTO, UpdateVendorSchema } from "../../../data/dto/vendor";

export class VendorControllers {
    constructor(
        private readonly createUseCase: CreateVendorUseCase,
        private readonly queryCase: QueryVendorsUseCase,
        private readonly getCase: GetVendorUseCase,
        private readonly updateProfileCase: UpdateVendorUseCase,
        private readonly verifyCase: VerifyVendorUseCase,
        private readonly deleteCase: DeleteVendorUseCase
    ) {
        this.createVendor = this.createVendor.bind(this);
        this.getVendor = this.getVendor.bind(this);
        this.updateVendor = this.updateVendor.bind(this);
        this.queryVendors = this.queryVendors.bind(this);
        this.verifyVendor = this.verifyVendor.bind(this);
        this.deleteVendor = this.deleteVendor.bind(this);
    }

    async createVendor(req: Request, res: Response, next: NextFunction) {
        try {
            const validate = validateData<CreateVendorDTO>(req.body, CreateVendorSchema);
            if (!validate.success) {
                const data = {
                    ...this.generateMetadata(req, "Validation Failed"),
                    status: EStatusCodes.enum.badRequest,
                    success: false,
                    description: validate.error
                }
                res.status(data.status).json(data);
                return;
            }

            const result = await this.createUseCase.execute(validate.data, {
                userId: req.user?.id!,
                roles: req.user?.roles!
            });
            if (!result.success) {
                const data = {
                    ...this.generateMetadata(req, result.error),
                    status: EStatusCodes.enum.conflict,
                    success: false
                }
                res.status(data.status).json(data);
                return;
            }

            const data: IResponseData<TVendor> = {
                ...this.generateMetadata(req, "Vendor created successfully"),
                status: EStatusCodes.enum.created,
                success: true,
                data: result.data
            }
            res.status(data.status).json(data);
        } catch (error) {
            next(error);
        }
    }

    async getVendor(req: Request, res: Response, next: NextFunction) {
        try {
            const vendorId = req.params.vendorId;
            if (!vendorId) {
                const data = {
                    ...this.generateMetadata(req, "Vendor ID is required"),
                    status: EStatusCodes.enum.badRequest,
                    success: false
                }
                res.status(data.status).json(data);
                return;
            }

            const result = await this.getCase.execute({ vendId: vendorId }, { roles: req.user?.roles!, userId: req.user?.id! });
            if (!result.success) {
                const data = {
                    ...this.generateMetadata(req, result.error ?? "Vendor Not Found"),
                    status: EStatusCodes.enum.notFound,
                    success: false
                }
                res.status(data.status).json(data);
                return;
            }

            const data: IResponseData<TVendor> = {
                ...this.generateMetadata(req, "Vendor retrieved successfully"),
                status: EStatusCodes.enum.ok,
                success: true,
                data: result.data
            }
            res.status(data.status).json(data);
        } catch (error) {
            next(error);
        }
    }

    async queryVendors(req: Request, res: Response, next: NextFunction) {
        try {
            const query = this.generateVendorQuery(req.query)
            const result = await this.queryCase.execute(query);
            if (!result.success) {
                const data = {
                    ...this.generateMetadata(req, result.error ?? "Failed to retrieve vendors"),
                    status: EStatusCodes.enum.badGateway,
                    success: false
                }
                res.status(data.status).json(data);
                return;
            }

            const data: IResponseDataPaginated<TVendor> = {
                ...this.generateMetadata(req, "Vendors retrieved successfully"),
                ...result.data,
                status: EStatusCodes.enum.ok,
                success: true,
            }
            res.status(data.status).json(data);
        } catch (error) {
            next(error);
        }
    }

    async updateVendor(req: Request, res: Response, next: NextFunction) {
        try {
            const validate = validateData<UpdateVendorDTO>(req.body, UpdateVendorSchema);
            if (!validate.success) {
                const data = {
                    ...this.generateMetadata(req, "Validation Failed"),
                    status: EStatusCodes.enum.badRequest,
                    success: false,
                    details: validate.error
                }
                res.status(data.status).json(data);
                return;
            }

            const result = await this.updateProfileCase.execute({
                data: req.body,
                id: req.body.id
            }, {
                userId: req.user?.id!,
                roles: req.user?.roles!
            });
            if (!result.success) {
                const data = {
                    ...this.generateMetadata(req, result.error ?? "Failed to update vendor"),
                    status: EStatusCodes.enum.conflict,
                    success: false
                }
                res.status(data.status).json(data);
                return;
            }

            const data: IResponseData<TVendor> = {
                ...this.generateMetadata(req, "Vendor updated successfully"),
                status: EStatusCodes.enum.ok,
                success: true,
                data: result.data
            }
            res.status(data.status).json(data);
        } catch (error) {
            next(error);
        }
    }

    async verifyVendor(req: Request, res: Response, next: NextFunction) {
        try {
            const vendorId = req.params.vendorId;
            const status = req.body.status;
            const reason = req.body.reason;

            const result = await this.verifyCase.execute({ id: vendorId, status, reason });
            if (!result.success) {
                const data = {
                    ...this.generateMetadata(req, result.error ?? "Failed to change vendor status"),
                    status: result.status ?? EStatusCodes.enum.badGateway,
                    success: false
                }
                res.status(data.status).json(data);
                return;
            }

            const data: IResponseData<TVendor> = {
                ...this.generateMetadata(req, "Vendor status updated successfully"),
                status: EStatusCodes.enum.ok,
                success: true,
                data: result.data
            }
            res.status(data.status).json(data);
        } catch (error) {
            next(error);
        }
    }

    async deleteVendor(req: Request, res: Response, next: NextFunction) {
        try {
            const vendorId = req.params.vendorId;
            const result = await this.deleteCase.execute(vendorId, { userId: req?.user?.id!, roles: req?.user?.roles! })

            if (!result.success) {
                const data = {
                    ...this.generateMetadata(req, result.error ?? "Failed to delete vendor"),
                    status: EStatusCodes.enum.conflict,
                    success: false
                }
                res.status(data.status).json(data);
                return;
            }

            const data = {
                ...this.generateMetadata(req, "Vendor deleted successfully"),
                status: EStatusCodes.enum.ok,
                success: true
            }
            res.status(data.status).json(data);
        } catch (error) {
            next(error);
        }
    }

    private generateMetadata(req: Request, message: string, type?: string) {
        return ({
            url: req.url,
            path: req.path,
            type: type ?? "Vendor",
            message,
            error: {
                message
            }
        })
    }
    private generateVendorQuery(query: qs.ParsedQs) {
        let {
            page = 1,
            limit = 10,
            sort_order = "asc",
            sort_by = "businessName"
        } =
            query;
        if (sort_by === 'name') {
            sort_by = 'businessName'
        }
        const sortByStr = String(sort_by);
        const sortOrderStr = String(sort_order);
        const sort = { [sortByStr]: sortOrderStr === 'desc' ? -1 : 1 }
        const searchTerm = typeof query.search === 'string' ? query.search : '';
        const search = searchTerm ? {
            $or: [
                { businessName: { $regex: searchTerm, $options: 'i' } },
            ]
        } : undefined;
        const filter = search ?? {
            isVerified: !query.show_unverified ? true : { "$in": [true, false] },
        }

        const queryOptions = {
            sort
        }
        const projection = {
            businessName: true,
            businessType: true,
            description: true,
            isVerified: true,
            userId: true,
            id: true,
            storefront: true,
            vendId: true,
            lastActiveAt: true,
            createdAt: true,
            updatedAt: true
        }
        const options: IQueryFilters<TVendor> = {
            filter,
            limit: Number(limit ?? 10),
            page: Number(page ?? 1),
            projection,
            queryOptions
        }
        return options
    }
}


const vendorRepository = new VendorRepositoryImpl(VendorModel);
export const vendorControllers = new VendorControllers(
    new CreateVendorUseCase(vendorRepository),
    new QueryVendorsUseCase(vendorRepository),
    new GetVendorUseCase(vendorRepository),
    new UpdateVendorUseCase(vendorRepository),
    new VerifyVendorUseCase(vendorRepository),
    new DeleteVendorUseCase(vendorRepository)
);
