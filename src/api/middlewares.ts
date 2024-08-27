import { requireCustomerAuthentication, type MiddlewaresConfig } from "@medusajs/medusa"
import type {
    Customer,
    CustomerService,
    MedusaNextFunction,
    MedusaRequest,
    MedusaResponse,
} from "@medusajs/medusa"

const registerLoggedInCustomer = async (
    req: MedusaRequest,
    res: MedusaResponse,
    next: MedusaNextFunction
) => {
    let loggedInCustomer: Customer | null = null
    if (req.user && req.user.customer_id) {
        const customerService =
            req.scope.resolve("customerService") as CustomerService
        loggedInCustomer = await customerService.retrieve(req.user.customer_id)
    }
    req.scope.register({
        loggedInCustomer: {
            resolve: () => loggedInCustomer,
        },
    })

    next()
}

// Custom middleware to exclude GET requests
const excludeGetMiddleware = (
    middlewares: Array<(req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) => void>
) => {
    return (req: MedusaRequest, res: MedusaResponse, next: MedusaNextFunction) => {
        if (req.method === "GET") {
            return next()
        }

        // Apply the provided middlewares for non-GET requests
        let index = 0

        const applyNextMiddleware = () => {
            if (index < middlewares.length) {
                middlewares[index++](req, res, applyNextMiddleware)
            } else {
                next()
            }
        }

        applyNextMiddleware()
    }
}

export const config: MiddlewaresConfig = {

    routes: [
        {
            matcher: "/store/blog/*",
            middlewares: [
                excludeGetMiddleware([
                    requireCustomerAuthentication(),
                    registerLoggedInCustomer
                ])
            ],
        },
    ],
}