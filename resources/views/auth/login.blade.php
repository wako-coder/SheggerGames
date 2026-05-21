@extends('layouts.app')

@section('content')

   <!-- breadcrumbs area start -->
    <div class="breadcrumbs_aree breadcrumbs_bg mb-140" data-bgimg="assets/img/bg/breadcrumbs-bg.webp">
        <div class="container">
            <div class="row">
                <div class="col-12">
                    <div class="breadcrumbs_text text-center">
                        <h1>Login</h1>
                        <ul class="d-flex justify-content-center">
                            <li><a href="/">Home </a></li>
                            <li> <span>//</span></li>
                            <li>  Login</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- breadcrumbs area end -->
<!-- page wrapper start -->
<div class="page_wrapper">

    <!-- contact section start -->
    <section class="contact_page_section mb-140">
        <div class="container">
            <div class="row justify-content-between align-items-center mb-n50">
                
                <!-- Image -->
                <div class="col-lg-6 col-md-8 col-12 mx-auto mb-50">
                    <img width="550" height="550" src="{{ asset('assets/img/others/about-thumb.webp') }}" alt="">
                </div>

                <!-- Login Form -->
                <div class="col-lg-5 col-md-8 col-12 mx-auto mb-50">
                    
                    <div class="section_title text-center mb-60">
                        <h2>Login</h2>
                    </div>

                    <form method="POST" action="{{ route('login-form') }}">
                        @csrf

                        <!-- Phone Number -->
                        <div class="form_input mb-3">
                            <input 
                                id="phone_number"
                                type="text"
                                name="phone_number"
                                placeholder="Phone Number"
                                value="{{ old('phone_number') }}"
                                class="@error('phone_number') is-invalid @enderror"
                                required
                                autofocus
                            >

                            @error('phone_number')
                                <small class="text-danger">{{ $message }}</small>
                            @enderror
                        </div>

                        <!-- Password -->
                        <div class="form_input mb-3">
                            <input 
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Password"
                                class="@error('password') is-invalid @enderror"
                                required
                            >

                            @error('password')
                                <small class="text-danger">{{ $message }}</small>
                            @enderror
                        </div>

                        <!-- Remember Me -->
                        <div class="form-check text-center mb-3">
                            <input 
                                class="form-check-input" 
                                type="checkbox" 
                                name="remember" 
                                id="remember" 
                                {{ old('remember') ? 'checked' : '' }}
                            >
                            <label class="form-check-label" for="remember">
                                Remember Me
                            </label>
                        </div>

                        <!-- Submit Button -->
                        <div class="form_input_btn text-center mb-40">
                            <button type="submit" class="btn btn-link">
                                Login
                                <img width="20" height="20" src="{{ asset('assets/img/icon/arrrow-icon.webp') }}" alt="">
                            </button>
                        </div>

                    </form>

                    <!-- Signup -->
                    <p class="text-center">
                        Don't have any account, 
                        {{-- <a href="{{ route('register') }}">Signup here</a> --}}
                    </p>

                </div>
            </div>
        </div>
    </section>
    <!-- contact section end -->

</div>
<!-- page wrapper end -->
@endsection

@push('scripts')
<script>
    document.addEventListener('DOMContentLoaded', function () {
        const phoneNumberInput = document.getElementById('phone_number');
        const loginForm = phoneNumberInput.closest('form');
        let validationMessage = document.createElement('small');
        validationMessage.classList.add('text-danger');
        validationMessage.style.display = 'none';
        phoneNumberInput.parentNode.insertBefore(validationMessage, phoneNumberInput.nextSibling);

        function validatePhoneNumber() {
            const phoneNumber = phoneNumberInput.value;
            if (!phoneNumber.startsWith('251')) {
                validationMessage.textContent = 'Phone number must start with 251.';
                validationMessage.style.display = 'block';
                phoneNumberInput.setCustomValidity('Invalid'); // Mark as invalid for form submission
            } else {
                validationMessage.textContent = '';
                validationMessage.style.display = 'none';
                phoneNumberInput.setCustomValidity(''); // Mark as valid
            }
        }

        phoneNumberInput.addEventListener('input', validatePhoneNumber);

        loginForm.addEventListener('submit', function (event) {
            validatePhoneNumber(); // Re-validate on submit
            if (!phoneNumberInput.checkValidity()) {
                event.preventDefault(); // Prevent form submission if invalid
            }
        });
    });
</script>
@endpush
