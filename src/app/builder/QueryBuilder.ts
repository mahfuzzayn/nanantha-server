import { FilterQuery, Query } from 'mongoose'

class QueryBuilder<T> {
    public modelQuery: Query<T[], T>
    public query: Record<string, unknown>

    constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
        this.modelQuery = modelQuery
        this.query = query
    }

    search(searchableFields: string[]) {
        const searchTerm = this?.query?.searchTerm
        if (searchTerm) {
            this.modelQuery = this.modelQuery.find({
                $or: searchableFields.map(
                    field =>
                        ({
                            [field]: { $regex: searchTerm, $options: 'i' },
                        }) as FilterQuery<T>,
                ),
            })
        }

        return this
    }

    filter() {
        const queryObj = { ...this.query } // Copy the query object

        // Exclude fields that are not part of the direct filter
        const excludeFields = [
            'searchTerm',
            'sort',
            'limit',
            'page',
            'fields',
            'minPrice',
            'maxPrice',
            'author',
            'category',
        ]
        excludeFields.forEach(el => delete queryObj[el])

        // Handling price range
        if (this.query.minPrice || this.query.maxPrice) {
            const minPrice = parseFloat(this.query.minPrice as string)
            const maxPrice = parseFloat(this.query.maxPrice as string)

            if (!isNaN(minPrice) || !isNaN(maxPrice)) {
                const priceFilter: Record<string, unknown> = {}
                if (!isNaN(minPrice)) priceFilter.$gte = minPrice
                if (!isNaN(maxPrice)) priceFilter.$lte = maxPrice
                queryObj.price = priceFilter
            }
        }

        // Handling category filtering
        if (this.query.category) {
            const categories = (this.query.category as string).split(',');
            queryObj.category = { $in: categories };
        }

        // Handling author filtering
        if (this.query.author) {
            const authors = (this.query.author as string).split(',');
            queryObj.author = { $in: authors };
        }

        this.modelQuery = this.modelQuery.find(queryObj as FilterQuery<T>)
        return this
    }

    sort() {
        const sort =
            (this?.query?.sort as string)?.split(',')?.join(' ') || '-createdAt'
        this.modelQuery = this.modelQuery.sort(sort as string)

        return this
    }

    paginate() {
        const page = Number(this?.query?.page) || 1
        const limit = Number(this?.query?.limit) || 10
        const skip = (page - 1) * limit

        this.modelQuery = this.modelQuery.skip(skip).limit(limit)

        return this
    }

    fields() {
        const fields =
            (this?.query?.fields as string)?.split(',')?.join(' ') || '-__v'

        this.modelQuery = this.modelQuery.select(fields)
        return this
    }
    async countTotal() {
        const totalQueries = this.modelQuery.getFilter()
        const total = await this.modelQuery.model.countDocuments(totalQueries)
        const page = Number(this?.query?.page) || 1
        const limit = Number(this?.query?.limit) || 10
        const totalPage = Math.ceil(total / limit)

        return {
            page,
            limit,
            total,
            totalPage,
        }
    }
}

export default QueryBuilder
