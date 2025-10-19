# 🧪 Interview System Testing Guide

## 🚀 **Quick Start Testing**

### **1. Access the Test Page**
Navigate to: `http://localhost:3000/test-interview`

This will show you the complete pre-interview setup system in action.

### **2. Test the Complete Flow**
1. Click "Launch Interview Setup"
2. Go through each step:
   - **Step 1**: Select skill level (Beginner/Intermediate/Advanced)
   - **Step 2**: Choose interview type (Technical/Soft Skills/Behavioral/System Design)
   - **Step 3**: Set duration (15/30/45 minutes)
   - **Step 4**: Equipment check (microphone, audio, internet, browser)
   - **Step 5**: Review configuration and start

---

## 🔧 **Individual Component Testing**

### **Test Skill Level Selector**
```tsx
import { SkillLevelSelector } from '@/components/interview/skill-level-selector';

function TestSkillLevel() {
  const [selectedLevel, setSelectedLevel] = useState<SkillLevel>();
  
  return (
    <SkillLevelSelector
      selectedLevel={selectedLevel}
      onLevelSelect={setSelectedLevel}
    />
  );
}
```

### **Test Interview Type Selector**
```tsx
import { InterviewTypeSelector } from '@/components/interview/interview-type-selector';

function TestInterviewType() {
  const [selectedType, setSelectedType] = useState<InterviewType>();
  
  return (
    <InterviewTypeSelector
      selectedType={selectedType}
      onTypeSelect={setSelectedType}
    />
  );
}
```

### **Test Duration Selector**
```tsx
import { DurationSelector } from '@/components/interview/duration-selector';

function TestDuration() {
  const [selectedDuration, setSelectedDuration] = useState<InterviewDuration>();
  
  return (
    <DurationSelector
      selectedDuration={selectedDuration}
      skillLevel={SkillLevel.INTERMEDIATE}
      onDurationSelect={setSelectedDuration}
    />
  );
}
```

### **Test Equipment Check**
```tsx
import { EquipmentCheck } from '@/components/interview/equipment-check';

function TestEquipment() {
  const handleCheckComplete = (result: EquipmentCheckResult) => {
    console.log('Equipment check result:', result);
  };
  
  return (
    <EquipmentCheck
      onCheckComplete={handleCheckComplete}
    />
  );
}
```

---

## 🎯 **Testing Scenarios**

### **Scenario 1: Happy Path**
1. **Skill Level**: Select "Intermediate"
2. **Interview Type**: Choose "Technical Skills"
3. **Duration**: Pick "30 minutes"
4. **Equipment**: All checks pass
5. **Result**: Should show configuration summary with potential reward

### **Scenario 2: Equipment Issues**
1. **Microphone**: Deny access or disconnect microphone
2. **Expected**: Should show error and recommendations
3. **Audio**: Disconnect speakers/headphones
4. **Expected**: Should show audio output error

### **Scenario 3: Browser Compatibility**
1. **Test in different browsers**: Chrome, Firefox, Safari, Edge
2. **Test on mobile**: iOS Safari, Chrome Mobile
3. **Expected**: Should detect compatibility issues

### **Scenario 4: Network Issues**
1. **Slow connection**: Use network throttling in DevTools
2. **No connection**: Disconnect internet
3. **Expected**: Should show network warnings

---

## 🛠️ **Development Testing**

### **Test Configuration System**
```typescript
import { 
  getSkillLevelConfig, 
  getInterviewTypeConfig, 
  calculatePotentialReward 
} from '@/lib/interview-config';

// Test skill level configs
const beginnerConfig = getSkillLevelConfig(SkillLevel.BEGINNER);
console.log('Beginner config:', beginnerConfig);

// Test reward calculation
const reward = calculatePotentialReward(
  SkillLevel.INTERMEDIATE, 
  InterviewType.TECHNICAL, 
  85 // performance score
);
console.log('Potential reward:', reward);
```

### **Test Equipment Check Service**
```typescript
import { EquipmentCheckService } from '@/lib/equipment-check';

const equipmentService = EquipmentCheckService.getInstance();

// Test full equipment check
const result = await equipmentService.performEquipmentCheck();
console.log('Equipment check result:', result);

// Test quick status
const status = await equipmentService.getQuickStatus();
console.log('Quick status:', status);
```

---

## 🐛 **Common Issues & Solutions**

### **Issue 1: Microphone Permission Denied**
**Problem**: Equipment check fails on microphone
**Solution**: 
- Check browser permissions
- Ensure microphone is not being used by another app
- Try refreshing the page

### **Issue 2: Audio Context Error**
**Problem**: Audio output check fails
**Solution**:
- Ensure user has interacted with the page (browser requirement)
- Check if audio is muted
- Try different browser

### **Issue 3: Network Check Fails**
**Problem**: Internet connection check fails
**Solution**:
- Ensure `/api/ping` endpoint is working
- Check if server is running
- Verify network connectivity

### **Issue 4: TypeScript Errors**
**Problem**: Import/export issues
**Solution**:
- Check file paths are correct
- Ensure all types are properly exported
- Verify component imports

---

## 📱 **Mobile Testing**

### **Test on MiniPay**
1. **Open in MiniPay browser**
2. **Test equipment check**: Should work with MiniPay's audio
3. **Test navigation**: Should be touch-friendly
4. **Test responsiveness**: Should adapt to mobile screen

### **Test on Regular Mobile**
1. **iOS Safari**: Test microphone permissions
2. **Android Chrome**: Test audio output
3. **Responsive design**: Check layout on different screen sizes

---

## 🔍 **Debugging Tools**

### **Browser DevTools**
```javascript
// Check microphone access
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => console.log('Mic access:', stream))
  .catch(err => console.log('Mic error:', err));

// Check audio context
const audioContext = new AudioContext();
console.log('Audio context:', audioContext.state);

// Check network
fetch('/api/ping')
  .then(res => console.log('Network:', res.ok))
  .catch(err => console.log('Network error:', err));
```

### **Console Logging**
Add debug logs to components:
```typescript
// In any component
useEffect(() => {
  console.log('Component mounted:', componentName);
}, []);
```

---

## ✅ **Testing Checklist**

### **Pre-Interview Setup**
- [ ] Skill level selection works
- [ ] Interview type selection works
- [ ] Duration selection works
- [ ] Equipment check works
- [ ] Configuration summary displays correctly
- [ ] Navigation between steps works
- [ ] Validation errors show properly

### **Equipment Check**
- [ ] Microphone access works
- [ ] Audio output works
- [ ] Internet connection check works
- [ ] Browser compatibility check works
- [ ] Error messages are helpful
- [ ] Recommendations are actionable

### **Responsive Design**
- [ ] Works on desktop
- [ ] Works on tablet
- [ ] Works on mobile
- [ ] Touch interactions work
- [ ] Text is readable
- [ ] Buttons are accessible

### **Integration**
- [ ] Components work together
- [ ] State management works
- [ ] Type safety maintained
- [ ] Performance is good
- [ ] No console errors

---

## 🚀 **Next Steps After Testing**

1. **Fix any issues** found during testing
2. **Integrate with VAPI** for actual interview functionality
3. **Add real reward system** with CELO transactions
4. **Implement interview recording** and playback
5. **Add analytics** and user progress tracking

---

*Happy testing! 🎉*
