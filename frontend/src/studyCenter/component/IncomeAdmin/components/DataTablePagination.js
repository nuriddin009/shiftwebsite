import {
    Button,
    Grid,
    Pagination,
    PaginationItem,
    Typography,
} from '@mui/material';


const DataTablePagination = (props) => {
    const {page, pageLimit, total, baseTotal, onChangePage} = props;
    const computePageCount = () => {
        return total === 0 || pageLimit === 0 ? 0 : Math.ceil(total / pageLimit);
    };

    const setSubMessage = () =>
        baseTotal && total < baseTotal
            ? `Filtered ${total} of ${baseTotal} results.`
            : `Loaded ${total} results`;

    return (
        <Grid
            container
            spacing={2}
            justifyContent='space-between'
            alignItems='center'
            sx={{paddingTop: '20px'}}
        >
            <Grid
                item
                xs='auto'
                container
                alignItems='center'
                justifyContent='center'
            >
                <Grid item>
                    <Typography>{setSubMessage()}</Typography>
                </Grid>
                <Grid item>
                    <Button
                        variant='text'
                        sx={{
                            padding: '0px 10px 0px 10px',
                            textTransform: 'unset',
                        }}
                    >
                        find more...
                    </Button>
                </Grid>
            </Grid>
            <Grid item xs='auto'>
                <Pagination
                    color='primary'
                    page={page}
                    count={computePageCount()}
                    onChange={(e, p) => onChangePage(p)}
                    renderItem={(item) => (
                        <PaginationItem
                            {...item}
                            components={{
                                previous: () => <Typography>Previous</Typography>,
                                next: () => <Typography>Next</Typography>,
                            }}
                        />
                    )}
                />
            </Grid>
        </Grid>
    );
};

export default DataTablePagination;
