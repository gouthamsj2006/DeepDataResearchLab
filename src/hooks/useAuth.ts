const signUp = async (email: string, password: string, userData: any) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.fullName,
          role: userData.role,
        }
      }
    });

    if (error) throw error;

    if (data.user) {
      // Create user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert({
          auth_user_id: data.user.id,
          full_name: userData.fullName,
          phone_number: userData.phoneNumber,
          email: userData.email,
          role: userData.role,
        });

      if (profileError) throw profileError;
    }
  };