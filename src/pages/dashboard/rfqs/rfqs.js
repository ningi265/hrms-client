import { useState, useEffect } from "react"
import { Link } from 'react-router-dom';
import { Button, Typography, Card, CardContent, CardHeader, CardActions, Box, CircularProgress } from "@mui/material"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material"
import { Menu, MenuItem } from "@mui/material"
import { Badge, Select, MenuItem as MuiMenuItem, InputAdornment, Input } from "@mui/material"
import { FilterList, Search, MoreHoriz, Add } from "@mui/icons-material"
import { useAuth } from "../../../authcontext/authcontext"

export default function RFQsPage() {
  const { user } = useAuth()
  const [rfqs, setRfqs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedRFQ, setSelectedRFQ] = useState(null)
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchRFQs = async () => {
      try {
        const mockRFQs = [
          {
            id: "rfq-001",
            itemName: "Office Furniture",
            quantity: 10,
            status: "open",
            procurementOfficer: {
              name: "John Doe",
              email: "john@example.com",
            },
            vendors: [
              { id: "v-001", name: "ABC Suppliers" },
              { id: "v-005", name: "Furniture Plus" },
            ],
            quotes: [],
            createdAt: "2023-03-15T10:30:00Z",
          },
          // More mock data
        ]
        setRfqs(mockRFQs)
      } catch (error) {
        console.error("Failed to fetch RFQs:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRFQs()
  }, [])

  const isAdmin = user?.role === "admin"
  const isProcurementOfficer = user?.role === "procurement_officer"
  const isVendor = user?.role === "vendor"

  const filteredRFQs = rfqs.filter((rfq) => {
    const matchesSearch = rfq.itemName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || rfq.status === statusFilter

    if (isVendor) {
      return matchesSearch && matchesStatus && rfq.vendors.some((v) => v.id === user?.id)
    }

    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh" // Full viewport height
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleMenuClick = (event, rfq) => {
    setAnchorEl(event.currentTarget)
    setSelectedRFQ(rfq)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
    setSelectedRFQ(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Typography variant="h4" component="h1">Request for Quotations</Typography>
        {(isAdmin || isProcurementOfficer) && (
          <Link href="/dashboard/rfqs/new">
            <Button variant="contained" color="primary">
              <Add className="mr-2" />
              New RFQ
            </Button>
          </Link>
        )}
      </div>

      <Card>
        <CardHeader
          title="Manage RFQs"
          subheader={isVendor ? "View and respond to RFQs you've been invited to" : "Create and manage requests for quotations"}
        />
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex w-full sm:w-auto items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search RFQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <Search />
                    </InputAdornment>
                  }
                  fullWidth
                />
              </div>
              <div className="flex items-center gap-2">
                <FilterList className="h-4 w-4 text-muted-foreground" />
                <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} displayEmpty>
                  <MuiMenuItem value="all">All Statuses</MuiMenuItem>
                  <MuiMenuItem value="open">Open</MuiMenuItem>
                  <MuiMenuItem value="closed">Closed</MuiMenuItem>
                </Select>
              </div>
            </div>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Item</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Quotes</TableCell>
                  <TableCell className="text-right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredRFQs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} style={{ textAlign: "center", padding: "16px" }}>No RFQs found</TableCell>
                  </TableRow>
                ) : (
                  filteredRFQs.map((rfq) => (
                    <TableRow key={rfq.id}>
                      <TableCell>{rfq.id}</TableCell>
                      <TableCell>{rfq.itemName}</TableCell>
                      <TableCell>{rfq.quantity}</TableCell>
                      <TableCell>{formatDate(rfq.createdAt)}</TableCell>
                      <TableCell>
                        {rfq.status === "open" ? (
                          <Badge color="success">Open</Badge>
                        ) : (
                          <Badge color="primary">Closed</Badge>
                        )}
                      </TableCell>
                      <TableCell>{rfq.quotes.length} / {rfq.vendors.length}</TableCell>
                      <TableCell className="text-right">
                        <Button onClick={(e) => handleMenuClick(e, rfq)} variant="outlined" size="small">
                          <MoreHoriz />
                        </Button>
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleCloseMenu}
                        >
                          <MenuItem component={Link} href={`/dashboard/rfqs/${rfq.id}`}>View Details</MenuItem>
                          {isVendor && rfq.status === "open" && (
                            <MenuItem component={Link} href={`/dashboard/rfqs/${rfq.id}/quote`}>Submit Quote</MenuItem>
                          )}
                          {(isAdmin || isProcurementOfficer) && rfq.status === "open" && rfq.quotes.length > 0 && (
                            <MenuItem>Select Vendor</MenuItem>
                          )}
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
