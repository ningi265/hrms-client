import React, { useState,useEffect } from "react";
import {
  Container,
  Typography,
  IconButton,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  TextField,
  FormControlLabel,
  Checkbox,
  MenuItem,
  InputAdornment,
  Button,
  Stepper,
  Step,
  StepLabel,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Box,
  LinearProgress
} from "@mui/material";
import { ArrowBack, Inventory, Category,History, Description, LocalShipping, AttachFile, Search, GetApp } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { Alert } from "@mui/material";
import { useDropzone } from "react-dropzone";
import { debounce } from "lodash";

const steps = ["Item Details", "Additional Information", "Review"];

const categories = [
  { name: "Electronics", items: ["Laptop", "Monitor", "Keyboard"] },
  { name: "Office Supplies", items: ["Pen", "Paper", "Stapler"] },
  { name: "Furniture", items: ["Chair", "Desk", "Cabinet"] },
];

const templates = [
  { name: "Laptop Request", itemName: "Laptop", quantity: 1, budgetCode: "IT-001" },
  { name: "Office Supplies", itemName: "Pen", quantity: 100, budgetCode: "OS-002" },
];

const requisitionHistory = [
  { id: 1, itemName: "Laptop", quantity: 5, status: "Approved", date: "2023-10-01" },
  { id: 2, itemName: "Chair", quantity: 10, status: "Pending", date: "2023-10-02" },
];

const forms = [
  { name: "Requisition Form", category: "General", url: "https://example.com/requisition-form.pdf" },
  { name: "Budget Approval Form", category: "Finance", url: "https://example.com/budget-approval-form.pdf" },
];

export default function NewRequisition() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [useCustomItem, setUseCustomItem] = useState(false);
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    selectedItem: "",
    quantity: "",
    budgetCode: "",
    urgency: "",
    preferredSupplier: "",
    reason: "",
    attachment: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [openFormsModal, setOpenFormsModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredForms, setFilteredForms] = useState(forms);
  const [openConfirmation, setOpenConfirmation] = useState(false);


  useEffect(() => {
    const autoSave = setTimeout(() => {
      localStorage.setItem("requisitionDraft", JSON.stringify(formData));
      console.log("Draft auto-saved");
    }, 30000); // Auto-save every 30 seconds
  
    return () => clearTimeout(autoSave);
  }, [formData]);


  useEffect(() => {
    const saveDraft = debounce(() => {
      localStorage.setItem("requisitionDraft", JSON.stringify(formData));
      console.log("Draft auto-saved");
    }, 2000); // Save after 2s delay
    
    saveDraft();
    return () => saveDraft.cancel();
  }, [formData]);


  const handleSubmitConfirmation = () => {
    setOpenConfirmation(true);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    setFormData((prev) => ({ ...prev, attachment: e.target.files[0] }));
  };

  const handleNextStep = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setActiveStep((prev) => prev - 1);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles) => {
      setFormData((prev) => ({ ...prev, attachment: acceptedFiles[0] }));
    },
  });
  


  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsDraftSaved(true);
    }, 2000);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setFilteredForms(forms.filter((form) => form.name.toLowerCase().includes(query.toLowerCase())));
  };

  const handleOpenHistoryModal = () => setOpenHistoryModal(true);
  const handleCloseHistoryModal = () => setOpenHistoryModal(false);
  const handleOpenFormsModal = () => setOpenFormsModal(true);
  const handleCloseFormsModal = () => setOpenFormsModal(false);

  return (
    <Container maxWidth="lg" sx={{ py: 4,backgroundColor: "", minHeight: "100vh" }}>
      {/* Page Title */}
     
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={6}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "black", display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => navigate("/employee-dash")} color="black" sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        New Requisition
      </Typography>
      <Typography variant="body1" color="black" sx={{ mb: 4 }}>
        Submit a new requisition request for approval
      </Typography>

          {/* Stepper */}
          <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Box sx={{ width: "100%", mt: 2 }}>
  <LinearProgress variant="determinate" value={(activeStep + 1) * (100 / steps.length)} />
</Box>

          {/* Form Card */}
          <Card elevation={3} sx={{ borderRadius: 3, boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", p: 3 }}>
            <form onSubmit={handleSubmit}>
              <CardHeader
                title={steps[activeStep]}
                titleTypographyProps={{ fontWeight: "bold", color: "primary.main" }}
              />
              <CardContent>
                <Grid container spacing={2}>
                  {activeStep === 0 && (
                    <>
                      <Grid item xs={12}>
                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={useCustomItem}
                              onChange={(e) => setUseCustomItem(e.target.checked)}
                              color="primary"
                            />
                          }
                          label="Use custom item"
                        />
                      </Grid>

                      {useCustomItem ? (
                        <Grid item xs={12}>
                          
                          <TextField
                            fullWidth
                            label="Custom Item Name"
                            name="itemName"
                            value={formData.itemName}
                            onChange={handleChange}
                            required
                            margin="normal"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Inventory color="primary" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        
                      ) : (
                        <>
                          <Grid item xs={12}>
                            <TextField
                              select
                              fullWidth
                              label="Category"
                              name="category"
                              value={formData.category}
                              onChange={(e) => {
                                setFormData((prev) => ({
                                  ...prev,
                                  category: e.target.value,
                                  selectedItem: "",
                                }));
                              }}
                              required
                              margin="normal"
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <Category color="primary" />
                                  </InputAdornment>
                                ),
                              }}
                            >
                              {categories.map((category) => (
                                <MenuItem key={category.name} value={category.name}>
                                  {category.name}
                                </MenuItem>
                              ))}
                            </TextField>
                          </Grid>

                          {formData.category && (
                            <Grid item xs={12}>
                              <TextField
                                select
                                fullWidth
                                label="Item"
                                name="selectedItem"
                                value={formData.selectedItem}
                                onChange={handleChange}
                                required
                                margin="normal"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Inventory color="primary" />
                                    </InputAdornment>
                                  ),
                                }}
                              >
                                {categories
                                  .find((cat) => cat.name === formData.category)
                                  .items.map((item) => (
                                    <MenuItem key={item} value={item}>
                                      {item}
                                    </MenuItem>
                                  ))}
                              </TextField>
                            </Grid>
                          )}
                        </>
                      )}

                      <Grid item xs={12}>
                      <TextField
  fullWidth
  label="Quantity"
  name="quantity"
  type="number"
  value={formData.quantity}
  onChange={handleChange}
  required
  margin="normal"
  error={formData.quantity <= 0}
  helperText={formData.quantity <= 0 ? "Quantity must be greater than 0" : ""}
  InputProps={{
    startAdornment: (
      <InputAdornment position="start">
        <Inventory color="primary" />
      </InputAdornment>
    ),
  }}
/>
                      </Grid>
                    </>
                  )}

                  {activeStep === 1 && (
                    <>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Budget Code"
                          name="budgetCode"
                          value={formData.budgetCode}
                          onChange={handleChange}
                          required
                          margin="normal"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Description color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          select
                          fullWidth
                          label="Urgency"
                          name="urgency"
                          value={formData.urgency}
                          onChange={handleChange}
                          margin="normal"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocalShipping color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        >
                          <MenuItem value="low">Low</MenuItem>
                          <MenuItem value="medium">Medium</MenuItem>
                          <MenuItem value="high">High</MenuItem>
                        </TextField>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Preferred Supplier (Optional)"
                          name="preferredSupplier"
                          value={formData.preferredSupplier}
                          onChange={handleChange}
                          margin="normal"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocalShipping color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          label="Reason for Request"
                          name="reason"
                          value={formData.reason}
                          onChange={handleChange}
                          required
                          margin="normal"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <Description color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      {/* Attachment Upload */}
                      <Grid item xs={12}>
                        <input
                          type="file"
                          id="attachment"
                          style={{ display: "none" }}
                          onChange={handleFileUpload}
                        />
                        <label htmlFor="attachment">
                          <Button
                            variant="outlined"
                            component="span"
                            startIcon={<AttachFile />}
                            sx={{ mb: 2 }}
                          >
                            Upload Attachment
                          </Button>
                          
                          
<div {...getRootProps()} style={{ border: "2px dashed #ccc", padding: 20, textAlign: "center" }}>
  <input {...getInputProps()} />
  <Typography>Drag & drop a file here, or click to select one</Typography>
</div>

                        </label>
                        {formData.attachment && (
                          <Typography variant="body2" sx={{ mb: 2 }}>
                            Attached: {formData.attachment.name}
                          </Typography>
                        )}
                      </Grid>
                    </>
                  )}

                  {activeStep === 2 && (
                    <Grid item xs={12}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Review Your Requisition
                      </Typography>
                      <Typography variant="body1"><strong>Item:</strong> {useCustomItem ? formData.itemName : formData.selectedItem}</Typography>
                      <Typography variant="body1"><strong>Quantity:</strong> {formData.quantity}</Typography>
                      <Typography variant="body1"><strong>Budget Code:</strong> {formData.budgetCode}</Typography>
                      <Typography variant="body1"><strong>Urgency:</strong> {formData.urgency}</Typography>
                      <Typography variant="body1"><strong>Preferred Supplier:</strong> {formData.preferredSupplier || "None"}</Typography>
                      <Typography variant="body1"><strong>Reason:</strong> {formData.reason}</Typography>
                      {formData.attachment && (
                        <Typography variant="body1"><strong>Attachment:</strong> {formData.attachment.name}</Typography>
                      )}
                    </Grid>
                  )}
                </Grid>
              </CardContent>
              <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
                <Button variant="outlined" onClick={handlePreviousStep} disabled={activeStep === 0}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={activeStep === steps.length - 1 ? handleSubmit : handleNextStep}
                  disabled={isSubmitting}
                >
                  {activeStep === steps.length - 1 ? (isSubmitting ? "Submitting..." : "Submit") : "Next"}
                </Button>
              </CardActions>
            </form>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
        <Button
          variant="contained"
          startIcon={<History />}
          onClick={handleOpenHistoryModal}
          sx={{ mb: 7 }}
        >
          View History
        </Button>
       
       

          {/* Download Forms Card */}
          <Card elevation={3} sx={{ borderRadius: 3, p: 3 }}>
            <CardHeader title="Download Forms" titleTypographyProps={{ fontWeight: "bold", color: "primary.main" }} />
            <CardContent>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search forms..."
                value={searchQuery}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />
              <Grid container spacing={2}>
                {filteredForms.map((form, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Card
                      elevation={2}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        p: 2,
                        borderRadius: 2,
                        transition: "transform 0.2s, box-shadow 0.2s",
                        ":hover": {
                          transform: "scale(1.05)",
                          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                        },
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1, color: "primary.main" }}>
                        {form.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Category: {form.category}
                      </Typography>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<GetApp />}
                        onClick={() => window.open(form.url, "_blank")}
                      >
                        Download
                      </Button>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* History Modal */}
      <Dialog open={openHistoryModal} onClose={handleCloseHistoryModal} fullWidth maxWidth="md">
        <DialogTitle>Requisition History</DialogTitle>
        <DialogContent>
          <List>
            {requisitionHistory.map((req) => (
              <div key={req.id}>
                <ListItem>
                  <ListItemText
                    primary={req.itemName}
                    secondary={`Quantity: ${req.quantity} | Status: ${req.status} | Date: ${req.date}`}
                  />
                  <Chip label={req.status} color={req.status === "Approved" ? "success" : "warning"} />
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseHistoryModal}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* PDF Forms Modal */}
      <Dialog open={openFormsModal} onClose={handleCloseFormsModal} fullWidth maxWidth="md">
        <DialogTitle>Download Forms</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search forms..."
            value={searchQuery}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2}>
            {filteredForms.map((form, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card
                  elevation={2}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 2,
                    borderRadius: 2,
                    transition: "transform 0.2s, box-shadow 0.2s",
                    ":hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.2)",
                    },
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: "bold", mb: 1, color: "primary.main" }}>
                    {form.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Category: {form.category}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<GetApp />}
                    onClick={() => window.open(form.url, "_blank")}
                  >
                    Download
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFormsModal}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmation} onClose={() => setOpenConfirmation(false)}>
  <DialogTitle>Confirm Submission</DialogTitle>
  <DialogContent>
    <Typography>Are you sure you want to submit this requisition?</Typography>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpenConfirmation(false)}>Cancel</Button>
    <Button onClick={handleSubmit} color="primary">Submit</Button>
  </DialogActions>
</Dialog>

      {/* Notifications */}
      <Snackbar
        open={isDraftSaved}
        autoHideDuration={3000}
        onClose={() => setIsDraftSaved(false)}
      >
        <Alert severity="success" onClose={() => setIsDraftSaved(false)}>
          Draft saved successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}