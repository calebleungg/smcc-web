class ChangePhoneToBeStringInMemberRequests < ActiveRecord::Migration[5.2]
  def change
    change_column :member_requests, :phone, :string
  end
end
