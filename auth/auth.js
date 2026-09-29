

    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const goToLogin = document.getElementById('goToLogin');

    const RESEND_SECONDS = 30;

    /* —— Tab switching —— */

    function showLogin(){
      loginTab.classList.add('active');
      signupTab.classList.remove('active');
      loginForm.classList.add('active');
      signupForm.classList.remove('active');
    }

    function showSignup(){
      signupTab.classList.add('active');
      loginTab.classList.remove('active');
      signupForm.classList.add('active');
      loginForm.classList.remove('active');
    }

    loginTab.addEventListener('click', showLogin);
    signupTab.addEventListener('click', showSignup);
    goToLogin.addEventListener('click', function(e){
      e.preventDefault();
      showLogin();
    });

    /* —— Helpers —— */

    function isValidMobile(value){
      return /^[6-9]\d{9}$/.test(value.trim());
    }

    function isValidOtp(value){
      return /^\d{6}$/.test(value.trim());
    }

    function onlyDigits(input){
      input.addEventListener('input', function(){
        this.value = this.value.replace(/\D/g, '');
      });
    }

    onlyDigits(document.getElementById('loginMobile'));
    onlyDigits(document.getElementById('loginOtp'));
    onlyDigits(document.getElementById('signupMobile'));
    onlyDigits(document.getElementById('signupOtp'));

  function createOtpController(config){
    const {
      mobileInput,
      otpInput,
      sendBtn,
      resendCountEl,
      resendTextEl,
      verifiedBadge,
      onOtpSent,
      onTimerEnd
    } = config;

    let timerId = null;
    let secondsLeft = 0;
    let otpSent = false;

    function setLoading(loading){
      sendBtn.classList.toggle('loading', loading);
      sendBtn.disabled = loading || secondsLeft > 0;
    }

    function updateResendUI(){
      if(secondsLeft > 0){
        resendCountEl.textContent = '(' + secondsLeft + 's)';
        sendBtn.querySelector('.btn-label').textContent = 'Resend (' + secondsLeft + 's)';
        sendBtn.disabled = true;
      } else {
        resendCountEl.textContent = '';
        sendBtn.querySelector('.btn-label').textContent = otpSent ? 'Resend OTP' : 'Send OTP';
        sendBtn.disabled = false;
        if(typeof onTimerEnd === 'function') onTimerEnd();
      }
    }

    function startTimer(){
      secondsLeft = RESEND_SECONDS;
      updateResendUI();
      clearInterval(timerId);
      timerId = setInterval(function(){
        secondsLeft -= 1;
        updateResendUI();
        if(secondsLeft <= 0){
          clearInterval(timerId);
          timerId = null;
        }
      }, 1000);
    }

    function simulateSendOtp(){
      if(!isValidMobile(mobileInput.value)){
        alert('कृपया सही 10 अंकों का मोबाइल नंबर दर्ज करें।');
        return;
      }

      setLoading(true);

      setTimeout(function(){
        setLoading(false);
        otpSent = true;
        otpInput.disabled = false;
        otpInput.focus();
        if(verifiedBadge) verifiedBadge.classList.add('visible');
        startTimer();
        if(typeof onOtpSent === 'function') onOtpSent();
      }, 1200);
    }

    sendBtn.addEventListener('click', simulateSendOtp);

    return {
      reset: function(){
        clearInterval(timerId);
        timerId = null;
        secondsLeft = 0;
        otpSent = false;
        otpInput.value = '';
        otpInput.disabled = true;
        if(verifiedBadge) verifiedBadge.classList.remove('visible');
        sendBtn.querySelector('.btn-label').textContent = 'Send OTP';
        resendCountEl.textContent = '';
        sendBtn.disabled = false;
        sendBtn.classList.remove('loading');
      },
      isOtpSent: function(){ return otpSent; }
    };
  }

    /* —— Login OTP flow —— */

    const loginMobile = document.getElementById('loginMobile');
    const loginOtp = document.getElementById('loginOtp');
    const loginSendOtp = document.getElementById('loginSendOtp');
    const loginVerifyBtn = document.getElementById('loginVerifyBtn');
    const loginTerms = document.getElementById('loginTerms');
    const loginResendCount = document.getElementById('loginResendCount');
    const loginOtpVerified = document.getElementById('loginOtpVerified');

    const loginOtpCtrl = createOtpController({
      mobileInput: loginMobile,
      otpInput: loginOtp,
      sendBtn: loginSendOtp,
      resendCountEl: loginResendCount,
      verifiedBadge: loginOtpVerified,
      onOtpSent: updateLoginVerifyState
    });

    function updateLoginVerifyState(){
      loginVerifyBtn.disabled = !(isValidOtp(loginOtp.value) && loginTerms.checked);
    }

    loginOtp.addEventListener('input', updateLoginVerifyState);
    loginTerms.addEventListener('change', updateLoginVerifyState);

    loginVerifyBtn.addEventListener('click', function(){
      if(!loginOtpCtrl.isOtpSent()){
        alert('कृपया पहले OTP भेजें।');
        return;
      }
      if(!isValidOtp(loginOtp.value)){
        alert('कृपया 6 अंकों का OTP दर्ज करें।');
        return;
      }
      if(!loginTerms.checked){
        alert('कृपया Terms & Conditions स्वीकार करें।');
        return;
      }
      loginVerifyBtn.disabled = true;
      loginVerifyBtn.textContent = 'Verifying...';
      setTimeout(function(){
        loginVerifyBtn.textContent = 'Verify & Login';
        // Persist auth (use existing saved name if present, else mobile-based fallback)
        var existing = (window.BV_AUTH && window.BV_AUTH.getUser()) || null;
        var name = (existing && existing.name) ? existing.name : ('Kisan');
        if (window.BV_AUTH) window.BV_AUTH.login({ name: name, mobile: loginMobile.value });
        alert('सफलतापूर्वक लॉगिन! BhoomiVeda में आपका स्वागत है।');
        if (window.BV_AUTH) {
          window.BV_AUTH.redirectAfterLogin();
        } else {
          window.location.href = '../home/index.html';
        }
      }, 1000);
    });

    loginMobile.addEventListener('input', function(){
      if(loginMobile.value.length < 10){
        loginOtpCtrl.reset();
        updateLoginVerifyState();
      }
    });

    /* —— Signup OTP flow —— */

    const signupName = document.getElementById('signupName');
    const signupMobile = document.getElementById('signupMobile');
    const signupOtp = document.getElementById('signupOtp');
    const signupSendOtp = document.getElementById('signupSendOtp');
    const signupVerifyOtp = document.getElementById('signupVerifyOtp');
    const signupCreateBtn = document.getElementById('signupCreateBtn');
    const signupTerms = document.getElementById('signupTerms');
    const signupResendCount = document.getElementById('signupResendCount');
    const signupOtpSent = document.getElementById('signupOtpSent');

    let signupOtpVerified = false;

    const signupOtpCtrl = createOtpController({
      mobileInput: signupMobile,
      otpInput: signupOtp,
      sendBtn: signupSendOtp,
      resendCountEl: signupResendCount,
      verifiedBadge: signupOtpSent,
      onOtpSent: function(){
        signupOtpVerified = false;
        signupVerifyOtp.disabled = false;
        signupCreateBtn.disabled = true;
      },
      onTimerEnd: function(){
        if(!signupOtpVerified) signupVerifyOtp.disabled = false;
      }
    });

    function updateSignupVerifyState(){
      signupVerifyOtp.disabled = !signupOtpCtrl.isOtpSent() || !isValidOtp(signupOtp.value);
    }

    signupOtp.addEventListener('input', updateSignupVerifyState);

    signupVerifyOtp.addEventListener('click', function(){
      if(!isValidOtp(signupOtp.value)){
        alert('कृपया 6 अंकों का OTP दर्ज करें।');
        return;
      }
      signupVerifyOtp.disabled = true;
      signupVerifyOtp.textContent = 'Verifying...';
      setTimeout(function(){
        signupOtpVerified = true;
        signupVerifyOtp.textContent = '✓ OTP Verified';
        signupVerifyOtp.style.background = '#2d6a4f';
        updateSignupCreateState();
      }, 900);
    });

    function updateSignupCreateState(){
      const nameOk = signupName.value.trim().length >= 2;
      const mobileOk = isValidMobile(signupMobile.value);
      const termsOk = signupTerms.checked;
      signupCreateBtn.disabled = !(signupOtpVerified && nameOk && mobileOk && termsOk);
    }

    signupName.addEventListener('input', updateSignupCreateState);
    signupMobile.addEventListener('input', function(){
      if(signupMobile.value.length < 10){
        signupOtpCtrl.reset();
        signupOtpVerified = false;
        signupVerifyOtp.textContent = 'Verify OTP';
        signupVerifyOtp.style.background = '';
        signupVerifyOtp.disabled = true;
        updateSignupCreateState();
      } else {
        updateSignupCreateState();
      }
    });
    signupTerms.addEventListener('change', updateSignupCreateState);

    signupCreateBtn.addEventListener('click', function(){
      if(!signupTerms.checked){
        alert('कृपया Terms & Conditions स्वीकार करें।');
        return;
      }
      const role = document.querySelector('input[name="userRole"]:checked').value;
      signupCreateBtn.disabled = true;
      signupCreateBtn.textContent = 'Creating...';
      setTimeout(function(){
        signupCreateBtn.textContent = 'Create Account';
        var name = (signupName.value || '').trim() || 'Kisan';
        if (window.BV_AUTH) window.BV_AUTH.login({ name: name, mobile: signupMobile.value, role: role });
        alert('अकाउंट सफलतापूर्वक बनाया गया! (' + (role === 'farmer' ? 'किसान' : 'विशेषज्ञ') + ')');
        if (window.BV_AUTH) {
          window.BV_AUTH.redirectAfterLogin();
        } else {
          window.location.href = '../home/index.html';
        }
      }, 1100);
    });

