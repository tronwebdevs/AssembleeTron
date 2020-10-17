<template>
    <centred-div>
        <form-card
            :loading="false"
            title="Gestione"
            text="Zona riservata"
            errorMsg="Autenticazione richiesta"
            :centred="true"
        >
            <LoginForm />
        </form-card>
    </centred-div>
</template>

<script>
import centreddiv from '@/components/centred-div';
import formcard from '@/components/form-card';
import LoginForm from '@/components/Admin/LoginForm';

export default {
    name: 'Login',
    components: {
        'form-card': formcard,
        'centred-div': centreddiv,
        LoginForm
    }
};
</script>
