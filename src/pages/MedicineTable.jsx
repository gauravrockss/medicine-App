import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Container,
    Typography,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';

const MedicineTable = () => {
    const [medicines, setMedicines] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [openAddMedicine, setOpenAddMedicine] = useState(false);
    const [openEditMedicine, setOpenEditMedicine] = useState(false);
    const [openDeleteMedicine, setOpenDeleteMedicine] = useState(false);
    const [openBuy, setOpenBuy] = useState(false);
    const [openSell, setOpenSell] = useState(false);
    const [newMedicine, setNewMedicine] = useState({ name: '', stock: 0 });
    const [selectedMedicineId, setSelectedMedicineId] = useState(null);
    const [buyQuantity, setBuyQuantity] = useState('');
    const [sellQuantity, setSellQuantity] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const savedMedicines = JSON.parse(localStorage.getItem('medicines')) || [];
        setMedicines(savedMedicines);
    }, []);

    useEffect(() => {
        localStorage.setItem('medicines', JSON.stringify(medicines));
    }, [medicines]);

    const handleSearchChange = event => {
        setSearchQuery(event.target.value);
    };

    const handleInputChange = event => {
        const { name, value } = event.target;
        setNewMedicine(prev => ({ ...prev, [name]: value }));
    };

    const handleAddMedicine = () => {
        const updatedMedicines = [...medicines, { ...newMedicine, stock: parseInt(newMedicine.stock, 10), _id: Date.now() }];
        setMedicines(updatedMedicines);
        setOpenAddMedicine(false);
        setNewMedicine({ name: '', stock: 0 });
    };

    const handleEditMedicine = () => {
        const updatedMedicines = medicines.map(medicine => (medicine._id === selectedMedicineId ? { ...medicine, ...newMedicine } : medicine));
        setMedicines(updatedMedicines);
        setOpenEditMedicine(false);
        setNewMedicine({ name: '', stock: 0 });
    };

    const handleDeleteMedicine = () => {
        const updatedMedicines = medicines.filter(medicine => medicine._id !== selectedMedicineId);
        setMedicines(updatedMedicines);
        setOpenDeleteMedicine(false);
    };

    const handleClickOpenBuy = id => {
        setSelectedMedicineId(id);
        setBuyQuantity('');
        setOpenBuy(true);
    };

    const handleClickOpenSell = id => {
        setSelectedMedicineId(id);
        setSellQuantity('');
        setOpenSell(true);
        setError('');
    };

    const handleClickOpenEdit = medicine => {
        setSelectedMedicineId(medicine._id);
        setNewMedicine({ name: medicine.name, stock: medicine.stock });
        setOpenEditMedicine(true);
    };

    const handleClickOpenDelete = id => {
        setSelectedMedicineId(id);
        setOpenDeleteMedicine(true);
    };

    const handleBuy = () => {
        const updatedMedicines = medicines.map(medicine =>
            medicine._id === selectedMedicineId ? { ...medicine, stock: medicine.stock + parseInt(buyQuantity, 10) } : medicine
        );
        setMedicines(updatedMedicines);
        setOpenBuy(false);
    };

    const handleSell = () => {
        const medicine = medicines.find(med => med._id === selectedMedicineId);
        if (medicine.stock < sellQuantity) {
            setError('Insufficient stock');
        } else {
            const updatedMedicines = medicines.map(med =>
                med._id === selectedMedicineId ? { ...med, stock: med.stock - parseInt(sellQuantity, 10) } : med
            );
            setMedicines(updatedMedicines);
            setOpenSell(false);
        }
    };

    const filteredMedicines = medicines.filter(medicine => medicine.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <Container maxWidth='false' sx={{ py: 5 }}>
            <Box display='flex' alignItems='center' justifyContent='space-between'>
                <Typography variant='h4' fontWeight={500}>
                    Medicine List
                </Typography>
                <Button variant='contained' color='primary' onClick={() => setOpenAddMedicine(true)}>
                    Add Medicine
                </Button>
            </Box>

            <TextField
                size='small'
                margin='dense'
                label='Search Medicine'
                fullWidth
                variant='outlined'
                value={searchQuery}
                onChange={handleSearchChange}
                sx={{ mt: 3 }}
            />

            <TableContainer component={Paper} sx={{ mt: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>S. No</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredMedicines.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                                    No data available
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredMedicines.map((medicine, index) => (
                                <TableRow key={medicine._id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{medicine.name}</TableCell>
                                    <TableCell>{medicine.stock}</TableCell>
                                    <TableCell>
                                        <Button variant='contained' color='primary' size='small' onClick={() => handleClickOpenBuy(medicine._id)}>
                                            Buy
                                        </Button>
                                        <Button
                                            variant='contained'
                                            color='secondary'
                                            size='small'
                                            sx={{ ml: 1 }}
                                            onClick={() => handleClickOpenSell(medicine._id)}>
                                            Sell
                                        </Button>
                                        <Button
                                            variant='contained'
                                            color='info'
                                            size='small'
                                            sx={{ ml: 1 }}
                                            onClick={() => handleClickOpenEdit(medicine)}>
                                            Edit
                                        </Button>
                                        <Button
                                            variant='contained'
                                            color='error'
                                            size='small'
                                            sx={{ ml: 1 }}
                                            onClick={() => handleClickOpenDelete(medicine._id)}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Add Medicine Dialog */}
            <Dialog open={openAddMedicine} onClose={() => setOpenAddMedicine(false)}>
                <DialogTitle>Add New Medicine</DialogTitle>
                <DialogContent>
                    <TextField
                        size='small'
                        margin='dense'
                        label='Medicine Name'
                        name='name'
                        fullWidth
                        variant='outlined'
                        value={newMedicine.name}
                        onChange={handleInputChange}
                    />
                    <TextField
                        size='small'
                        margin='dense'
                        label='Stock'
                        name='stock'
                        type='number'
                        fullWidth
                        variant='outlined'
                        value={newMedicine.stock}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddMedicine(false)} color='secondary'>
                        Cancel
                    </Button>
                    <Button onClick={handleAddMedicine} color='primary'>
                        Add
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Medicine Dialog */}
            <Dialog open={openEditMedicine} onClose={() => setOpenEditMedicine(false)}>
                <DialogTitle>Edit Medicine</DialogTitle>
                <DialogContent>
                    <TextField
                        size='small'
                        margin='dense'
                        label='Medicine Name'
                        name='name'
                        fullWidth
                        variant='outlined'
                        value={newMedicine.name}
                        onChange={handleInputChange}
                    />
                    <TextField
                        size='small'
                        margin='dense'
                        label='Stock'
                        name='stock'
                        type='number'
                        fullWidth
                        variant='outlined'
                        value={newMedicine.stock}
                        onChange={handleInputChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditMedicine(false)} color='secondary'>
                        Cancel
                    </Button>
                    <Button onClick={handleEditMedicine} color='primary'>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Medicine Confirmation Dialog */}
            <Dialog open={openDeleteMedicine} onClose={() => setOpenDeleteMedicine(false)}>
                <DialogTitle>Delete Medicine</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this medicine?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteMedicine(false)} color='secondary'>
                        Cancel
                    </Button>
                    <Button onClick={handleDeleteMedicine} color='error'>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Buy and Sell dialogs */}
            <Dialog open={openBuy} onClose={() => setOpenBuy(false)}>
                <DialogTitle>Buy Medicine</DialogTitle>
                <DialogContent>
                    <TextField
                        size='small'
                        margin='dense'
                        label='Quantity to Buy'
                        type='number'
                        fullWidth
                        variant='outlined'
                        value={buyQuantity}
                        onChange={e => setBuyQuantity(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenBuy(false)} variant='contained' color='secondary' size='small'>
                        Cancel
                    </Button>
                    <Button onClick={handleBuy} variant='contained' color='primary' size='small'>
                        Buy
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Sell Medicine Dialog */}
            <Dialog open={openSell} onClose={() => setOpenSell(false)}>
                <DialogTitle>Sell Medicine</DialogTitle>
                <DialogContent>
                    <TextField
                        size='small'
                        margin='dense'
                        label='Quantity to Sell'
                        type='number'
                        fullWidth
                        variant='outlined'
                        value={sellQuantity}
                        onChange={e => setSellQuantity(e.target.value)}
                    />
                    {error && (
                        <Typography variant='caption' color='error'>
                            {error}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSell(false)} variant='contained' color='secondary' size='small'>
                        Cancel
                    </Button>
                    <Button onClick={handleSell} variant='contained' color='primary' size='small'>
                        Sell
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MedicineTable;
