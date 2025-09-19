# Cut to Size Calculation Guide

## Overview

This guide explains the enhanced Cut to Size calculation functionality that automatically calculates:
1. **Quantity per Sheet** - How many cut pieces can fit in one full sheet
2. **Number of Full Sheets Required** - How many full sheets are needed for the required quantity

## New Features Added

### 1. Quantity per Sheet Calculation

**Purpose**: Determines how many cut pieces can fit in a single full sheet.

**Calculation Logic**:
```javascript
// Parse full sheet dimensions (e.g., "1220x2420")
const fullSheetLength = parseFloat(fullSheetDimensions[0]);
const fullSheetWidth = parseFloat(fullSheetDimensions[1]);

// Calculate pieces that fit horizontally and vertically
const piecesHorizontally = Math.floor(fullSheetLength / cutLengthNum);
const piecesVertically = Math.floor(fullSheetWidth / cutWidthNum);

// Total quantity per sheet (whole number only)
const totalPiecesPerSheet = piecesHorizontally * piecesVertically;
```

**Example**:
- Full Sheet Size: 1220mm × 2420mm
- Cut Size: 300mm × 400mm
- Pieces Horizontally: Math.floor(1220 / 300) = 4 pieces
- Pieces Vertically: Math.floor(2420 / 400) = 6 pieces
- **Quantity per Sheet: 4 × 6 = 24 pieces**

### 2. Number of Full Sheets Required Calculation

**Purpose**: Determines how many full sheets are needed to fulfill the required quantity.

**Calculation Logic**:
```javascript
// Calculate number of full sheets needed (round up to whole number)
const sheetsRequired = Math.ceil(quantityNum / quantityPerSheetNum);
```

**Example**:
- Required Quantity: 100 pieces
- Quantity per Sheet: 24 pieces
- **Number of Full Sheets Required: Math.ceil(100 / 24) = 5 sheets**

## User Interface Updates

### New Input Fields

1. **Quantity per Sheet** (Read-only)
   - Auto-calculated field
   - Shows format: "24 pieces"
   - Updates when cut dimensions or full sheet size changes

2. **Number of Full Sheets Required** (Read-only)
   - Auto-calculated field
   - Shows format: "5 sheets"
   - Updates when quantity or quantity per sheet changes

### Updated Quotation Modal

The Cut to Size quotation modal now includes:
- Quantity per Sheet information
- Number of Full Sheets Required
- Enhanced calculation explanation

## Calculation Flow

### Step-by-Step Process

1. **User Input**:
   - Selects full sheet size (e.g., "1220x2420")
   - Enters cut length (e.g., 300mm)
   - Enters cut width (e.g., 400mm)
   - Enters required quantity (e.g., 100 pieces)

2. **Automatic Calculations**:
   - **Cut Size Area**: 300 × 400 = 120,000 sq units
   - **Quantity per Sheet**: Math.floor(1220/300) × Math.floor(2420/400) = 4 × 6 = 24 pieces
   - **Number of Full Sheets Required**: Math.ceil(100/24) = 5 sheets

3. **Price Calculation**:
   - Uses existing price per unit calculation
   - Includes machining costs
   - Shows total price

## Technical Implementation

### State Variables Added

```javascript
const [quantityPerSheet, setQuantityPerSheet] = useState('');
const [numberOfFullSheetsRequired, setNumberOfFullSheetsRequired] = useState('');
```

### useEffect Hooks Added

1. **Quantity per Sheet Calculation**:
   - Triggers when: `cutLength`, `cutWidth`, or `selectedSize` changes
   - Calculates pieces that fit horizontally and vertically
   - Updates `quantityPerSheet` state

2. **Number of Full Sheets Required Calculation**:
   - Triggers when: `quantity` or `quantityPerSheet` changes
   - Calculates sheets needed using Math.ceil()
   - Updates `numberOfFullSheetsRequired` state

### Validation Rules

- **Cut Dimensions**: Must be positive numbers
- **Full Sheet Size**: Must be selected and valid
- **Quantity**: Must be a positive integer
- **Results**: Always whole numbers (no decimals)

## Benefits

1. **Accurate Planning**: Users know exactly how many full sheets they need
2. **Cost Optimization**: Helps optimize material usage and reduce waste
3. **Automated Calculations**: No manual calculations required
4. **Real-time Updates**: Calculations update automatically as inputs change
5. **Whole Number Results**: Ensures practical, usable quantities
6. **Enhanced Quotations**: More detailed and informative quotations

## Example Scenarios

### Scenario 1: Small Cut Pieces
- Full Sheet: 1220mm × 2420mm
- Cut Size: 100mm × 150mm
- Required Quantity: 500 pieces
- **Result**: 192 pieces per sheet, 3 full sheets required

### Scenario 2: Large Cut Pieces
- Full Sheet: 1220mm × 2420mm
- Cut Size: 600mm × 800mm
- Required Quantity: 10 pieces
- **Result**: 2 pieces per sheet, 5 full sheets required

### Scenario 3: Optimal Fit
- Full Sheet: 1220mm × 2420mm
- Cut Size: 305mm × 403mm
- Required Quantity: 8 pieces
- **Result**: 4 pieces per sheet, 2 full sheets required

## Error Handling

- **Invalid Dimensions**: Shows appropriate error messages
- **Missing Data**: Displays helpful placeholder text
- **Zero Results**: Handles edge cases gracefully
- **Console Logging**: Detailed logging for debugging

## Future Enhancements

Potential improvements could include:
- **Waste Calculation**: Show percentage of material waste
- **Alternative Orientations**: Calculate both orientations and suggest optimal
- **Multiple Sheet Sizes**: Compare different full sheet sizes
- **Cost per Piece**: Include material cost per individual piece
- **Visual Layout**: Show visual representation of cutting layout

## Support

For technical support or questions about the Cut to Size calculations:
1. Check browser console for detailed calculation logs
2. Verify all input fields are properly filled
3. Ensure full sheet size is selected
4. Contact development team for assistance
