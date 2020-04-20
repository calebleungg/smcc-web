class ApplicationController < ActionController::Base
    before_action :configure_permitted_parameters, if: :devise_controller?

    protected
    def configure_permitted_parameters
        devise_parameter_sanitizer.permit(:sign_up, keys: [:admin, :first_name, :last_name, :year_grad, :phone, :address, :country])
        devise_parameter_sanitizer.permit(:account_update, keys: [:admin, :first_name, :last_name, :year_grad, :phone, :address, :counntry])
    end
end
