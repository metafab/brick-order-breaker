# Cache Brique Game Specifications

## Overview
Cache Brique is a memory-based number sequencing game where players must click on hidden numbers in ascending order. The game features multiple levels with increasing difficulty and various mechanics.

## Game Mechanics

### Basic Gameplay
- Numbers are hidden behind "bricks" marked with question marks (?)
- Players must click bricks to reveal numbers
- Numbers must be clicked in ascending order
- Incorrect clicks result in penalties depending on the level

### Level Structure
The game consists of 11 levels with progressive difficulty:

#### Level 1-3 (Always Accessible)
- **Level 1**: Basic number sequence with 6 bricks
- **Level 2**: Numbers reset on wrong click
- **Level 3**: Time limit of 30 seconds

#### Level 4-11 (Requires Previous Level Completion)
- **Level 4**: Increased to 8 bricks
- **Level 5**: Lives system (10 lives)
- **Level 6**: Roman numerals instead of regular numbers
- **Level 7**: Random numbers (not sequential 1-6/8)
- **Level 8**: Fox emoji quantities (1-6 🦊)
- **Level 9**: Simple mathematical expressions (e.g., "2+3", "8-5")
- **Level 10**: Different clock times (e.g., "3:15", "11:45")
- **Level 11**: Mix of numbers, roman numerals, and emojis

## Level Details

### Level 1
- 6 bricks
- Numbers 1-6 in random positions
- No penalties for wrong clicks
- Basic introduction to game mechanics

### Level 2
- 6 bricks
- Numbers 1-6 in random positions
- Progress resets on wrong click
- All revealed numbers are hidden again on error

### Level 3
- 6 bricks
- 30-second time limit
- Progress bar showing remaining time
- Game ends if time runs out
- Progress resets on wrong click

### Level 4
- 8 bricks instead of 6
- Numbers 1-8 in random positions
- Progress resets on wrong click
- Requires completion of levels 1-3

### Level 5
- 6 bricks
- 10 lives system
- Heart display showing remaining lives
- Lose a life on wrong click
- Game ends when all lives are lost
- Requires completion of levels 1-4

### Level 6
- 6 bricks
- Numbers displayed as Roman numerals
- Progress resets on wrong click
- Requires completion of levels 1-5

### Level 7
- 6 bricks
- Random numbers (not sequential 1-6)
- Must be clicked in ascending order
- Progress resets on wrong click
- Requires completion of levels 1-6

### Level 8
- 6 bricks
- Displays 1-6 fox emojis (🦊) instead of numbers
- Must be clicked in ascending order of emoji quantity
- Progress resets on wrong click
- Requires completion of levels 1-7

### Level 9
- 6 bricks
- Simple mathematical expressions (e.g., "2+3", "8-5")
- Must be clicked in ascending order based on results
- Progress resets on wrong click
- Requires completion of levels 1-8

### Level 10
- 6 bricks
- Different clock times (e.g., "3:15", "11:45")
- Must be clicked in chronological order
- Progress resets on wrong click
- Requires completion of levels 1-9

### Level 11
- 6 bricks
- Mix of numbers, roman numerals, and emojis
- Must be clicked in ascending order
- Progress resets on wrong click
- Requires completion of levels 1-10

## Progress Tracking
- Completed levels are saved in localStorage
- Best times for each level are recorded
- Checkmark appears on completed levels
- Completion time displayed under each completed level

## UI Features
- Responsive design
- Language switcher (i18n support)
- Toast notifications for game events
- Confetti animation on level completion
- Progress indicators (timer, lives, etc.)
- Color feedback for correct/incorrect clicks

## Navigation
- Home screen with level selection grid
- Level accessibility rules:
  - Levels 1-3 always accessible
  - Levels 4+ require completion of all previous levels
- Return to home button during gameplay
- Restart level button during gameplay

## Visual Feedback
- Green highlight for correct clicks
- Red highlight for incorrect clicks
- Animated brick flips
- Progress indicators
- Success/failure notifications
