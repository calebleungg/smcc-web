class CreateMemberRequests < ActiveRecord::Migration[5.2]
  def change
    create_table :member_requests do |t|
      t.string :first_name
      t.string :last_name
      t.string :email
      t.date :year_graduated
      t.numeric :phone
      t.string :address
      t.string :country
      t.string :password_pref
      t.boolean :approved

      t.timestamps
    end
  end
end
