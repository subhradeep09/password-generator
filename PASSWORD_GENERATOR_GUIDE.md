# Password Generator Documentation

## Overview
SecureVault includes a powerful, multi-purpose password generator with three distinct generation modes: **Password**, **Passphrase**, and **PIN**. The generator is available both as a modal within the vault and as a standalone page.

## Access Points

### 1. Within Vault Dashboard
- **Quick Generator**: Click "Generate Password" button in the header
- **Advanced Generator**: Click "Advanced Generator" link for full-featured page

### 2. Standalone Page
- **Direct URL**: `/generator`
- **From Landing Page**: Click "Try Password Generator →" link

## Generation Modes

### 🔐 Password Mode
Generates cryptographically secure random passwords with extensive customization options.

#### Features:
- **Length**: 4-128 characters (recommended: 16+)
- **Character Types**:
  - Uppercase letters (A-Z)
  - Lowercase letters (a-z)  
  - Numbers (0-9)
  - Symbols (!@#$%^&*...)
  - Custom characters (user-defined)
- **Security Options**:
  - Exclude similar characters (il1Lo0O)
  - Exclude ambiguous characters ({}[]()/<>)
  - Crypto-secure randomization when available

#### Strength Analysis:
Real-time password strength scoring (1-8) based on:
- Length (12+ characters)
- Character variety
- No repeated patterns
- Not a common password
- Bonus points for 16+ and 20+ characters

### 🔗 Passphrase Mode
Generates memorable passphrases using common English words.

#### Features:
- **Word Count**: 2-8 words
- **Separator**: Customizable (-, _, space, etc.)
- **Options**:
  - Capitalize first letter of each word
  - Include random numbers
  - Word length constraints (3-8 characters)
- **Word List**: 60+ carefully selected common words

#### Example Output:
- `Apple-Beach-Cloud-Dance`
- `Mountain42-Ocean-Tiger91`
- `golden_castle_harmony_river`

### 📱 PIN Mode
Generates numeric PINs for devices and secure codes.

#### Features:
- **Length**: 4-12 digits
- **Options**:
  - Allow/disallow repeated digits
  - Cryptographically secure generation
- **Use Cases**: Device unlock, 2FA backup codes, secure numeric passwords

## Advanced Features

### 🎯 Batch Generation
- Generate 5 variations at once
- Quick comparison and selection
- Ideal for finding the perfect password

### 💾 History & Management
- **Recent Results**: View last 10 generated items
- **Quick Copy**: One-click clipboard copy
- **Auto-Clear**: Clipboard clears after 30 seconds
- **Download**: Save results as text files
- **Share**: Native share API support (mobile)

### 🎨 User Interface
- **Dark/Light Mode**: Full theme support
- **Show/Hide**: Toggle password visibility
- **Real-time Updates**: Options change results instantly
- **Responsive Design**: Works on all devices
- **Accessibility**: Keyboard navigation and screen reader support

## Security Features

### 🔒 Cryptographic Security
- **Web Crypto API**: Uses `crypto.getRandomValues()` when available
- **Fallback**: Secure Math.random() for older browsers
- **No Server Communication**: All generation happens client-side
- **Memory Safety**: No password storage or logging

### 🛡️ Privacy Protection
- **Auto-Clear Clipboard**: Prevents accidental data leaks
- **No Analytics**: Zero tracking of generated passwords
- **Offline Capable**: Works without internet connection
- **Local Storage**: Only preferences stored, never passwords

## API Integration

The password generator can be integrated into other components:

```typescript
import { generatePassword, generatePassphrase, calculatePasswordStrength } from '@/lib/password-generator'

// Generate a secure password
const password = generatePassword({
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeSimilar: true
})

// Generate a memorable passphrase
const passphrase = generatePassphrase({
  wordCount: 4,
  separator: '-',
  capitalize: true,
  includeNumbers: true
})

// Analyze password strength
const strength = calculatePasswordStrength(password)
// Returns: { score: 8, label: 'Very Strong', color: 'bg-green-500' }
```

## Best Practices

### 🎯 For Maximum Security:
1. **Length**: Use 16+ characters for passwords
2. **Variety**: Include all character types
3. **Uniqueness**: Generate unique passwords for each account
4. **Exclusions**: Enable similar/ambiguous character exclusion
5. **Regular Updates**: Regenerate passwords periodically

### 💡 For Memorability:
1. **Passphrases**: Use 4-6 word passphrases for primary accounts
2. **Separators**: Choose memorable separators (-, _, space)
3. **Capitalization**: Enable for better readability
4. **Numbers**: Add for complexity without hurting memorability

### 📱 For Mobile/Devices:
1. **PINs**: Use 6+ digit PINs
2. **No Repeats**: Disable repeated digits for better security
3. **Backup Codes**: Generate multiple PINs for 2FA backup

## Browser Compatibility

### ✅ Fully Supported:
- Chrome 47+
- Firefox 36+
- Safari 11+
- Edge 79+

### ⚠️ Limited Support:
- Internet Explorer: Basic functionality only
- Older browsers: Fallback to Math.random()

## Performance

- **Generation Speed**: <100ms for any configuration
- **Memory Usage**: Minimal (all operations are stateless)
- **Bundle Size**: +2KB for word list and algorithms
- **Battery Impact**: Negligible on mobile devices

## Troubleshooting

### Common Issues:
1. **"At least one character type must be selected"**
   - Enable at least one character type option
   
2. **Blank password generated**
   - Check browser compatibility
   - Disable ad blockers that might block crypto APIs
   
3. **Copy not working**
   - Ensure HTTPS connection (required for clipboard API)
   - Use manual selection as fallback

### Performance Issues:
- **Slow generation with very long passwords (100+ chars)**
  - Normal behavior due to increased randomization
  - Consider shorter passwords for better UX

## Future Enhancements

### Planned Features:
- [ ] Password policy templates (corporate, gaming, etc.)
- [ ] Pronunciation guide for passphrases
- [ ] QR code generation for easy mobile transfer
- [ ] Integration with HaveIBeenPwned API
- [ ] Custom word lists for passphrases
- [ ] Export/import of generator preferences
- [ ] Advanced entropy visualization

### Performance Improvements:
- [ ] Web Worker for intensive generation
- [ ] Progressive enhancement for older browsers
- [ ] Caching for repeated operations